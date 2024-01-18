import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Not, In } from 'typeorm';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
  ) {}

  async findAll(): Promise<MeetingRoom[]> {
    return this.meetingRoomRepository.find({ relations: { equipments: true } });
  }

  async findAvailableMeetingRooms(
    bookedMeetingRoomIds: string[],
  ): Promise<MeetingRoom[]> {
    return await this.meetingRoomRepository.find({
      where: { id: Not(In(bookedMeetingRoomIds)) },
      relations: { equipments: true },
    });
  }
}
