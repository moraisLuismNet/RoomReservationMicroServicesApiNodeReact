import { AppDataSource } from "../config/database";
import { RoomType } from "../models/RoomType";
import { CreateRoomTypeDto, UpdateRoomTypeDto } from "../dtos/room-type.dto";
import logger from "../utils/logger";

export class RoomTypeService {
  private get roomTypeRepository() {
    return AppDataSource.getRepository(RoomType);
  }

  async getAllRoomTypes() {
    return await this.roomTypeRepository.find();
  }

  async getRoomTypeById(id: number) {
    const roomType = await this.roomTypeRepository.findOne({ where: { id } });
    if (!roomType) {
      throw new Error("Room type not found");
    }
    return roomType;
  }

  async createRoomType(dto: CreateRoomTypeDto) {
    const existingRoomType = await this.roomTypeRepository.findOne({
      where: { name: dto.name },
    });

    if (existingRoomType) {
      throw new Error("Room type with this name already exists");
    }

    const roomType = this.roomTypeRepository.create(dto);
    await this.roomTypeRepository.save(roomType);
    logger.info(`Room type created: ${roomType.name}`);
    return roomType;
  }

  async updateRoomType(id: number, dto: UpdateRoomTypeDto) {
    const roomType = await this.getRoomTypeById(id);

    if (dto.name && dto.name !== roomType.name) {
      const existingRoomType = await this.roomTypeRepository.findOne({
        where: { name: dto.name },
      });
      if (existingRoomType) {
        throw new Error("Room type with this name already exists");
      }
    }

    Object.assign(roomType, dto);
    await this.roomTypeRepository.save(roomType);
    logger.info(`Room type updated: ${roomType.id}`);
    return roomType;
  }

  async deleteRoomType(id: number) {
    const roomType = await this.getRoomTypeById(id);
    await this.roomTypeRepository.remove(roomType);
    logger.info(`Room type deleted: ${id}`);
  }
}
