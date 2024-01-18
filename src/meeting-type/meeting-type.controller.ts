import { Controller, Get } from '@nestjs/common';
import { MeetingTypeService } from './meeting-type.service';
import { MeetingType } from './entities/meeting-type.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MeetingType')
@Controller('meeting-type')
export class MeetingTypeController {
  constructor(private readonly meetingTypeService: MeetingTypeService) {}

  @Get()
  findAll(): Promise<MeetingType[]> {
    return this.meetingTypeService.findAll();
  }
}
