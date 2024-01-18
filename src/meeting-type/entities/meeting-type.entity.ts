import { BaseEntity } from '@core/entities/base.entity';
import { Equipment } from '@equipment/entities/equipment.entity';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

@Entity('meeting_type')
export class MeetingType extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Equipment)
  @JoinTable({
    name: 'meeting_type_equipment',
    joinColumn: {
      name: 'meeting_type_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'equipment_id',
      referencedColumnName: 'id',
    },
  })
  equipments: Equipment[];
}
