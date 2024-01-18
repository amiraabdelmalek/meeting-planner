import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Reservation } from '@reservation/entities/reservation.entity';
import { ReservationModule } from '@reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment, Reservation]),
    forwardRef(() => ReservationModule), // Use forwardRef here
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService], // Make sure to export the service
})
export class EquipmentModule {}
