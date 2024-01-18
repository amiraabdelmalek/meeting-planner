import { Equipment } from '@equipment/entities/equipment.entity';
import { MeetingRoom } from '@meeting-room/entities/meeting-room.entity';

export interface AllocationResponse {
  meetingRoom: MeetingRoom;
  requiredEquipments: Equipment[];
}
