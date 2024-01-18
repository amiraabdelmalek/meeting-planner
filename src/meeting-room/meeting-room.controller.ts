import { Controller, Get } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoom } from './entities/meeting-room.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MeetingRoom')
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get()
  findAll(): Promise<MeetingRoom[]> {
    return this.meetingRoomService.findAll();
  }
}
