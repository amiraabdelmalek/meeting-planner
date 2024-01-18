import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Equipment } from '@equipment/entities/equipment.entity';
import { EquipmentModule } from '@equipment/equipment.module';
import { MeetingRoomModule } from '@meeting-room/meeting-room.module';
import { MeetingTypeModule } from '@meeting-type/meeting-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Equipment]),
    forwardRef(() => EquipmentModule),
    MeetingRoomModule,
    MeetingTypeModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService], // Make sure to export the service
})
export class ReservationModule {}
