import { Request, Response } from "express";
import { ReservationService } from "../services/reservation.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateReservationDto } from "../dtos/reservation.dto";
import logger from "../utils/logger";

const reservationService = new ReservationService();

export class ReservationController {
  async getAllReservations(req: Request, res: Response) {
    try {
      const reservations = await reservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error: any) {
      logger.error(`Error in getAllReservations: ${error.message}`, {
        stack: error.stack,
      });
      res.status(500).json({ message: error.message });
    }
  }

  async getReservationsByUserId(req: Request, res: Response) {
    try {
      const userEmail = req.params.userId; // Keep param name for route compatibility
      const reservations = await reservationService.getReservationsByUserEmail(
        userEmail
      );
      res.status(200).json(reservations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getReservationsByRoomId(req: Request, res: Response) {
    try {
      const roomId = parseInt(req.params.roomId);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }
      const reservations = await reservationService.getReservationsByRoomId(
        roomId
      );
      res.status(200).json(reservations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getReservationById(req: Request, res: Response) {
    try {
      const reservation = await reservationService.getReservationById(
        parseInt(req.params.id)
      );
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.status(200).json(reservation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createReservation(req: any, res: Response) {
    try {
      const dto = plainToInstance(CreateReservationDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      if (!req.user || !req.user.email) {
        return res.status(400).json({ message: "User email missing in token" });
      }

      const reservationData = {
        ...dto,
        userEmail: req.user.email, // Use email from JWT token
      };

      const reservation = await reservationService.createReservation(
        reservationData
      );
      res.status(201).json(reservation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateReservation(req: Request, res: Response) {
    try {
      const updatedReservation = await reservationService.updateReservation(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json(updatedReservation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async cancelReservation(req: Request, res: Response) {
    try {
      await reservationService.cancelReservation(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
