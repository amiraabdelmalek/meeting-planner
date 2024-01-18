import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { MeetingType } from '@meeting-type/entities/meeting-type.entity';
import { MeetingRoom } from '@meeting-room/entities/meeting-room.entity';
import { Equipment } from '@equipment/entities/equipment.entity';
import { BaseEntity } from '@core/entities/base.entity';

@Entity()
export class Reservation extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'integer' })
  capacity: number;

  @ManyToOne(() => MeetingType)
  @JoinColumn({
    name: 'meeting_type_id',
    referencedColumnName: 'id',
  })
  meetingType: MeetingType;

  @ManyToMany(() => Equipment)
  @JoinTable({
    name: 'reservation_equipment',
    joinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'equipment_id',
      referencedColumnName: 'id',
    },
  })
  equipments: Equipment[];

  @ManyToOne(() => MeetingRoom)
  @JoinColumn({
    name: 'meeting_room_id',
    referencedColumnName: 'id',
  })
  meetingRoom: MeetingRoom;
}
