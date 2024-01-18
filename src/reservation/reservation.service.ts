import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { MeetingTypeService } from '@meeting-type/meeting-type.service';
import { EquipmentService } from '@equipment/equipment.service';
import { MeetingRoom } from '@meeting-room/entities/meeting-room.entity';
import { MoreThan, LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Equipment } from '@equipment/entities/equipment.entity';
import { AllocationResponse } from './types/allocation-response.interface';
import { MeetingRoomService } from '@meeting-room/meeting-room.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    private readonly meetingRoomService: MeetingRoomService,
    private readonly meetingTypeService: MeetingTypeService,

    @Inject(forwardRef(() => EquipmentService))
    private readonly equipmentService: EquipmentService,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: { meetingRoom: true, meetingType: true, equipments: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findReservationEquipmentWithTimeSLot(
    equipmentId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: [
        {
          equipments: { id: equipmentId },
          startTime: LessThanOrEqual(endTime),
          endTime: MoreThanOrEqual(startTime),
        },
      ],
      relations: { equipments: true },
    });
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const meetingType = await this.meetingTypeService.findOneById(
      createReservationDto.meetingTypeId,
    );
    if (!meetingType) {
      throw new NotFoundException(
        `meeting type with id ${createReservationDto.meetingTypeId} not found`,
      );
    }
    if (meetingType.code === 'RS' && createReservationDto.capacity < 4) {
      throw new UnprocessableEntityException(
        'Les réunions simples (RS) nécessitent plus de 3 participants.',
      );
    }
    const allocationResponse =
      await this.allocateMeetingRoom(createReservationDto);

    if (!allocationResponse) {
      throw new NotFoundException(
        "Aucune salle de réunion disponible pour l'heure et les critères sélectionnés.",
      );
    }

    const reservationCount = await this.reservationRepository.count();
    const newReservationName = `Réunion ${reservationCount + 1}`;
    const reservationData = {
      ...createReservationDto,
      name: newReservationName,
      meetingRoom: allocationResponse.meetingRoom,
      meetingType,
      equipments: allocationResponse.requiredEquipments,
    };

    return this.reservationRepository.save(reservationData);
  }

  async allocateMeetingRoom(
    createReservationDto: CreateReservationDto,
  ): Promise<AllocationResponse | null> {
    const { startTime, endTime, meetingTypeId, capacity } =
      createReservationDto;

    const availableMeetingRooms = await this.getAvailableRooms(
      startTime,
      endTime,
    );
    const meetingRoomsWithCapacity = availableMeetingRooms.filter(
      (meetingRoom) =>
        this.calculateAdjustedCapacity(capacity, meetingRoom.capacity),
    );

    const meetingType =
      await this.meetingTypeService.findOneById(meetingTypeId);

    let equipmentToAllocate: Equipment[] = [];
    let bestRoom: MeetingRoom | null = null;
    let smallestCapacityDifference = Number.MAX_SAFE_INTEGER;
    let leastEquipmentNeeded = Number.MAX_SAFE_INTEGER;

    for (const meetingRoom of meetingRoomsWithCapacity) {
      const equipmentCheckResponse =
        await this.equipmentService.hasRequiredEquipments(
          meetingRoom,
          meetingType.equipments,
          startTime,
          endTime,
        );
      if (equipmentCheckResponse.success) {
        const adjustedRoomCapacity = Math.floor(meetingRoom.capacity * 0.7);
        const capacityDifference = adjustedRoomCapacity - capacity;
        const movableEquipmentCount =
          equipmentCheckResponse.movableEquipmentNeeded.length;

        // if (
        //   !bestRoom ||
        //   (capacityDifference >= 0 &&
        //     capacityDifference < smallestCapacityDifference) ||
        //   (capacityDifference === smallestCapacityDifference &&
        //     equipmentCheckResponse.movableEquipmentNeeded.length <
        //       equipmentToAllocate.length)
        // ) {
        //   bestRoom = meetingRoom;
        //   equipmentToAllocate = equipmentCheckResponse.movableEquipmentNeeded;
        //   smallestCapacityDifference = capacityDifference;
        // }
        if (!bestRoom || movableEquipmentCount < leastEquipmentNeeded) {
          // Prioritize rooms requiring the least additional equipment
          bestRoom = meetingRoom;
          equipmentToAllocate = equipmentCheckResponse.movableEquipmentNeeded;
          leastEquipmentNeeded = movableEquipmentCount;
          smallestCapacityDifference = capacityDifference;
        } else if (
          movableEquipmentCount === leastEquipmentNeeded &&
          capacityDifference >= 0 &&
          capacityDifference < smallestCapacityDifference
        ) {
          // Use capacity as a tie-breaker
          bestRoom = meetingRoom;
          equipmentToAllocate = equipmentCheckResponse.movableEquipmentNeeded;
          smallestCapacityDifference = capacityDifference;
        }
      }
    }
    if (!bestRoom) {
      return null;
    }

    return { meetingRoom: bestRoom, requiredEquipments: equipmentToAllocate };
  }

  async getAvailableRooms(
    startTime: string,
    endTime: string,
  ): Promise<MeetingRoom[]> {
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    const cleaningBuffer = 60 * 60 * 1000;

    const bookedmeetingRooms = await this.reservationRepository.find({
      where: [
        {
          startTime: LessThan(new Date(endTimeDate.getTime() + cleaningBuffer)),
          endTime: MoreThan(startTimeDate),
        },
      ],
      relations: { meetingRoom: true },
    });

    const bookedmeetingRoomIds = bookedmeetingRooms.map(
      (reservation) => reservation.meetingRoom.id,
    );
    return await this.meetingRoomService.findAvailableMeetingRooms(
      bookedmeetingRoomIds,
    );
  }

  calculateAdjustedCapacity(
    requestedCapacity: number,
    meetingRoomCapacity: number,
  ): boolean {
    const adjustedRoomCapacity = Math.floor(meetingRoomCapacity * 0.7);
    return requestedCapacity <= adjustedRoomCapacity;
  }
}
