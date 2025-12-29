import { AppDataSource } from "../config/database";
import { ReservationStatus } from "../models/ReservationStatus";
import {
  CreateReservationStatusDto,
  UpdateReservationStatusDto,
} from "../dtos/reservation-status.dto";
import logger from "../utils/logger";

export class ReservationStatusService {
  private get reservationStatusRepository() {
    return AppDataSource.getRepository(ReservationStatus);
  }

  async getAllReservationStatuses() {
    return await this.reservationStatusRepository.find();
  }

  async getReservationStatusById(id: number) {
    const status = await this.reservationStatusRepository.findOne({
      where: { id },
    });
    if (!status) {
      throw new Error("Reservation status not found");
    }
    return status;
  }

  async createReservationStatus(dto: CreateReservationStatusDto) {
    const existingStatus = await this.reservationStatusRepository.findOne({
      where: { name: dto.name },
    });

    if (existingStatus) {
      throw new Error("Reservation status with this name already exists");
    }

    const status = this.reservationStatusRepository.create(dto);
    await this.reservationStatusRepository.save(status);
    logger.info(`Reservation status created: ${status.name}`);
    return status;
  }

  async updateReservationStatus(id: number, dto: UpdateReservationStatusDto) {
    const status = await this.getReservationStatusById(id);

    if (dto.name && dto.name !== status.name) {
      const existingStatus = await this.reservationStatusRepository.findOne({
        where: { name: dto.name },
      });
      if (existingStatus) {
        throw new Error("Reservation status with this name already exists");
      }
    }

    Object.assign(status, dto);
    await this.reservationStatusRepository.save(status);
    logger.info(`Reservation status updated: ${status.id}`);
    return status;
  }

  async deleteReservationStatus(id: number) {
    const status = await this.getReservationStatusById(id);
    await this.reservationStatusRepository.remove(status);
    logger.info(`Reservation status deleted: ${id}`);
  }
}
