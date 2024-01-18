import { Equipment } from '@equipment/entities/equipment.entity';

export interface EquipmentCheckResponse {
  success: boolean;
  movableEquipmentNeeded: Equipment[];
}
