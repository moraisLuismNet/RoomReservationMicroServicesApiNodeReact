import { Request, Response } from "express";
import { RoomService } from "../services/room.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateRoomDto, UpdateRoomDto } from "../dtos/room.dto";
import logger from "../utils/logger";

const roomService = new RoomService();

export class RoomController {
  async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await roomService.getAllRooms();
      res.status(200).json(rooms);
    } catch (error: any) {
      logger.error(`Error in getAllRooms: ${error.message}`, {
        stack: error.stack,
      });
      res.status(500).json({ message: error.message });
    }
  }

  async getAvailableRooms(req: Request, res: Response) {
    try {
      const rooms = await roomService.getAvailableRooms();
      res.status(200).json(rooms);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoomById(req: Request, res: Response) {
    try {
      const room = await roomService.getRoomById(parseInt(req.params.id));
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.status(200).json(room);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createRoom(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateRoomDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const room = await roomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateRoom(req: Request, res: Response) {
    try {
      const dto = plainToInstance(UpdateRoomDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedRoom = await roomService.updateRoom(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json(updatedRoom);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteRoom(req: Request, res: Response) {
    try {
      await roomService.deleteRoom(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
