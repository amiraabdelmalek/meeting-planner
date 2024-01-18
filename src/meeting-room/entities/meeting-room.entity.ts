import { BaseEntity } from '@core/entities/base.entity';
import { MeetingRoomStatus } from '@meeting-room/enum/meeting-room-status.enum';
import { Equipment } from '@equipment/entities/equipment.entity';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

@Entity('meeting_room')
export class MeetingRoom extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({
    type: 'enum',
    default: MeetingRoomStatus.AVAILABLE,
    enum: MeetingRoomStatus,
  })
  status: MeetingRoomStatus;

  @ManyToMany(() => Equipment)
  @JoinTable({
    name: 'meeting_room_equipment',
    joinColumn: {
      name: 'meeting_room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'equipment_id',
      referencedColumnName: 'id',
    },
  })
  equipments: Equipment[];
}
