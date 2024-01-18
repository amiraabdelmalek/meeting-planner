import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingType } from './entities/meeting-type.entity';

@Injectable()
export class MeetingTypeService {
  constructor(
    @InjectRepository(MeetingType)
    private meetingTypeRepository: Repository<MeetingType>,
  ) {}

  async findAll(): Promise<MeetingType[]> {
    return this.meetingTypeRepository.find({ relations: { equipments: true } });
  }

  async findOneById(id: string): Promise<MeetingType> {
    const meetingType = await this.meetingTypeRepository.findOne({
      where: { id },
      relations: { equipments: true },
    });

    if (!meetingType) {
      throw new NotFoundException(`meetingType with id ${id} not found`);
    }

    return meetingType;
  }
}
