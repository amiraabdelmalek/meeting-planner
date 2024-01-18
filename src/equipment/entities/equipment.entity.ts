import { BaseEntity } from '@core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('equipment')
export class Equipment extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'integer' })
  quantity: number;
}
