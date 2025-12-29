import { apiClient } from "../core/apiClient";
import { RoomType } from "../models/room-type.model";

export const roomTypeService = {
  getRoomTypes: async (): Promise<RoomType[]> => {
    return apiClient.get<RoomType[]>("/api/room-types");
  },

  getRoomType: async (id: number): Promise<RoomType> => {
    return apiClient.get<RoomType>(`/api/room-types/${id}`);
  },
};
