export interface MeetingRoom {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  name: string;
  capacity: number;
  status: string;
}
