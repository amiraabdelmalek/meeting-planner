import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingType } from './entities/meeting-type.entity';
import { MeetingTypeService } from './meeting-type.service';
import { MeetingTypeController } from './meeting-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingType])],
  controllers: [MeetingTypeController],
  providers: [MeetingTypeService],
  exports: [MeetingTypeService],
})
export class MeetingTypeModule {}
