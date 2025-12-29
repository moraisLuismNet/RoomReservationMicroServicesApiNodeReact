import { apiClient } from "../core/apiClient";
import { User } from "../models/user.model";
import { Reservation } from "../models/reservation.model";

export const adminService = {
  getAllUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>("/api/users");
  },

  getAllReservations: async (): Promise<Reservation[]> => {
    return apiClient.get<Reservation[]>("/api/reservations");
  },
};
