import { RoomType } from "./room-type.model";

export interface Room {
  roomId: number;
  roomNumber: string;
  roomTypeId: number;
  roomType: RoomType;
  isActive: boolean;
  imageRoom?: string;
}
