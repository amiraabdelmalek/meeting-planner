import { MeetingRoom } from './MeetingRoom';
import { MeetingType } from './MeetingType';
import { Equipment } from './Equipment';

export interface Reservation {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  name: string;
  createdBy: string;
  startTime: string;
  endTime: string;
  capacity: number;
  meetingRoom: MeetingRoom;
  meetingType: MeetingType;
  equipments: Equipment[];
}

export interface ReservationFormData {
  createdBy: string;
  startTime: Date;
  endTime: Date | null;
  capacity: number;
  meetingTypeId: string;
}
