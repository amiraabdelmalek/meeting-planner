import { DataSource, DataSourceOptions } from 'typeorm';
import { MeetingType } from '@meeting-type/entities/meeting-type.entity';
import { MeetingRoom } from '@meeting-room/entities/meeting-room.entity';
import { Equipment } from '@equipment/entities/equipment.entity';
import { Reservation } from '@reservation/entities/reservation.entity';
import * as dotenv from 'dotenv';
import { CreateTables1630428304000 } from '@migrations/1630428304000-CreateTables';
import { InsertData1630428305000 } from '@migrations/1630428305000-InsertData';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Equipment, MeetingType, MeetingRoom, Reservation],
  migrations: [CreateTables1630428304000, InsertData1630428305000],
  logging: true,
  synchronize: false,
  migrationsTransactionMode: 'each',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
