import { User } from "./user.model";
import { Room } from "./room.model";

export interface ReservationStatus {
  id: number;
  name: string;
  description?: string;
}

export interface Reservation {
  id: number;
  statusId: number;
  status?: ReservationStatus | string; // Handle both for safety during migration
  userEmail: string;
  user?: User;
  roomId: number;
  room?: Room;
  reservationDate: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  cancellationDate?: string;
  cancellationReason?: string;
}

export interface CreateReservation {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  email?: string;
  reservationDate: string;
  numberOfNights: number;
  totalPrice: number;
}
