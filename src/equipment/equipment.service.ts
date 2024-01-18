import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { MeetingRoom } from '@meeting-room/entities/meeting-room.entity';
import { EquipmentCheckResponse } from './types/equipment-check-response.interface';
import { ReservationService } from '@reservation/reservation.service';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,

    @Inject(forwardRef(() => ReservationService))
    private readonly reservationService: ReservationService,
  ) {}

  async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository.find();
  }

  async findOneById(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
    });

    if (!equipment) {
      throw new NotFoundException(`equipment with id ${id} not found`);
    }

    return equipment;
  }

  async hasRequiredEquipments(
    meetingRoom: MeetingRoom,
    requiredEquipments: Equipment[],
    startTime: string,
    endTime: string,
  ): Promise<EquipmentCheckResponse> {
    const movableEquipmentNeeded: Equipment[] = [];

    const isFixedEquipmentSufficient = requiredEquipments.every((equipment) =>
      meetingRoom.equipments.includes(equipment),
    );

    if (isFixedEquipmentSufficient) {
      return { success: true, movableEquipmentNeeded: [] };
    }

    for (const equipment of requiredEquipments) {
      if (
        !meetingRoom.equipments.some(
          (roomEquipment) => roomEquipment.id === equipment.id,
        )
      ) {
        const movableEquipment = await this.findOneById(equipment.id);
        if (movableEquipment) {
          const isAvailable = await this.checkEquipmentAvailability(
            movableEquipment,
            startTime,
            endTime,
          );
          if (isAvailable) {
            movableEquipmentNeeded.push(movableEquipment);
          } else {
            return { success: false, movableEquipmentNeeded: [] };
          }
        }
      }
    }

    return { success: true, movableEquipmentNeeded: movableEquipmentNeeded };
  }

  async checkEquipmentAvailability(
    equipment: Equipment,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    const overlappingReservations =
      await this.reservationService.findReservationEquipmentWithTimeSLot(
        equipment.id,
        startTimeDate,
        endTimeDate,
      );
    let usageCount = 0;
    overlappingReservations.forEach((reservation) => {
      if (reservation.equipments.some((eq) => eq.id === equipment.id)) {
        usageCount++;
      }
    });

    return equipment.quantity > usageCount;
  }
}
