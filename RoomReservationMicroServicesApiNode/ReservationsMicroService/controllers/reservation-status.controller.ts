import { Request, Response } from "express";
import { ReservationStatusService } from "../services/reservation-status.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import {
  CreateReservationStatusDto,
  UpdateReservationStatusDto,
} from "../dtos/reservation-status.dto";

const reservationStatusService = new ReservationStatusService();

export class ReservationStatusController {
  async getAllReservationStatuses(req: Request, res: Response) {
    try {
      const statuses =
        await reservationStatusService.getAllReservationStatuses();
      res.status(200).json(statuses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getReservationStatusById(req: Request, res: Response) {
    try {
      const status = await reservationStatusService.getReservationStatusById(
        parseInt(req.params.id)
      );
      res.status(200).json(status);
    } catch (error: any) {
      if (error.message === "Reservation status not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async createReservationStatus(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateReservationStatusDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const status = await reservationStatusService.createReservationStatus(
        req.body
      );
      res.status(201).json(status);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateReservationStatus(req: Request, res: Response) {
    try {
      const dto = plainToInstance(UpdateReservationStatusDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedStatus =
        await reservationStatusService.updateReservationStatus(
          parseInt(req.params.id),
          req.body
        );
      res.status(200).json(updatedStatus);
    } catch (error: any) {
      if (error.message === "Reservation status not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  async deleteReservationStatus(req: Request, res: Response) {
    try {
      await reservationStatusService.deleteReservationStatus(
        parseInt(req.params.id)
      );
      res.status(204).send();
    } catch (error: any) {
      if (error.message === "Reservation status not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}
