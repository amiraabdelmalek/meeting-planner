import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@configs/data-source';
import { EquipmentModule } from '@equipment/equipment.module';
import { MeetingRoomModule } from '@meeting-room/meeting-room.module';
import { MeetingTypeModule } from '@meeting-type/meeting-type.module';
import { ReservationModule } from '@reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    EquipmentModule,
    MeetingTypeModule,
    MeetingRoomModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
