import { apiClient } from "../core/apiClient";
import { Room } from "../models/room.model";

let roomsCache: Room[] | null = null;

export const roomService = {
  getRooms: async (): Promise<Room[]> => {
    if (roomsCache) {
      return roomsCache;
    }

    const rooms = await apiClient.get<Room[]>("/api/rooms", {
      params: { _limit: "20" },
    });
    roomsCache = rooms;
    return rooms;
  },

  getRoom: async (id: number): Promise<Room> => {
    return apiClient.get<Room>(`/api/rooms/${id}`);
  },

  createRoom: async (room: any): Promise<Room> => {
    roomsCache = null;
    return apiClient.post<Room>("/api/rooms", room);
  },

  updateRoom: async (id: number, room: any): Promise<Room> => {
    roomsCache = null;
    return apiClient.put<Room>(`/api/rooms/${id}`, room);
  },

  deleteRoom: async (id: number): Promise<void> => {
    roomsCache = null;
    return apiClient.delete(`/api/rooms/${id}`);
  },

  clearCache: () => {
    roomsCache = null;
  },
};
