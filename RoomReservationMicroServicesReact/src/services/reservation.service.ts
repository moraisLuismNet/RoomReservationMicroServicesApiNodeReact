import { apiClient } from "../core/apiClient";
import { Reservation, CreateReservation } from "../models/reservation.model";

export const reservationService = {
  createReservation: async (reservation: CreateReservation): Promise<any> => {
    return apiClient.post("/api/reservations", reservation);
  },

  getMyReservations: async (email: string): Promise<Reservation[]> => {
    if (!email) {
      return [];
    }
    // Backend now uses /user/:userId but accepts email as the parameter
    return apiClient.get<Reservation[]>(`/api/reservations/user/${email}`);
  },

  getReservationsByRoom: async (roomId: number): Promise<Reservation[]> => {
    return apiClient.get<Reservation[]>(`/api/reservations/room/${roomId}`);
  },

  cancelReservation: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/reservations/${id}`);
  },
};
