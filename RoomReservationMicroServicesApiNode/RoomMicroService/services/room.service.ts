import { AppDataSource } from "../config/database";
import { Room as RoomEntity } from "../models/Room";

export class RoomService {
  private roomRepository = AppDataSource.getRepository(RoomEntity);

  async getAllRooms() {
    return await this.roomRepository.find({ relations: ["roomType"] });
  }

  async getRoomById(id: number) {
    return await this.roomRepository.findOne({
      where: { roomId: id },
      relations: ["roomType"],
    });
  }

  async createRoom(roomData: any) {
    const room = this.roomRepository.create(roomData);
    return await this.roomRepository.save(room);
  }

  async updateRoom(id: number, roomData: any) {
    await this.roomRepository.update({ roomId: id }, roomData);
    return await this.getRoomById(id);
  }

  async deleteRoom(id: number) {
    await this.roomRepository.delete({ roomId: id });
  }

  async getAvailableRooms() {
    return await this.roomRepository.find({
      where: { isActive: true },
      relations: ["roomType"],
    });
  }
}
