import { Request, Response } from "express";
import { RoomTypeService } from "../services/room-type.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateRoomTypeDto, UpdateRoomTypeDto } from "../dtos/room-type.dto";

const roomTypeService = new RoomTypeService();

export class RoomTypeController {
  async getAllRoomTypes(req: Request, res: Response) {
    try {
      const roomTypes = await roomTypeService.getAllRoomTypes();
      res.status(200).json(roomTypes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoomTypeById(req: Request, res: Response) {
    try {
      const roomType = await roomTypeService.getRoomTypeById(
        parseInt(req.params.id)
      );
      res.status(200).json(roomType);
    } catch (error: any) {
      if (error.message === "Room type not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async createRoomType(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateRoomTypeDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const roomType = await roomTypeService.createRoomType(req.body);
      res.status(201).json(roomType);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateRoomType(req: Request, res: Response) {
    try {
      const dto = plainToInstance(UpdateRoomTypeDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedRoomType = await roomTypeService.updateRoomType(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json(updatedRoomType);
    } catch (error: any) {
      if (error.message === "Room type not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  async deleteRoomType(req: Request, res: Response) {
    try {
      await roomTypeService.deleteRoomType(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      if (error.message === "Room type not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}
