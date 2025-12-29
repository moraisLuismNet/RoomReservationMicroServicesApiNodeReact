import { AppDataSource } from "../config/database";
import { Reservation, ReservationStatusEnum } from "../models/Reservation";

export class ReservationService {
  private reservationRepository = AppDataSource.getRepository(Reservation);

  private fixReservationData(res: Reservation | null): Reservation | null {
    if (!res) return null;
    if (
      (res.numberOfNights === 0 || !res.numberOfNights) &&
      res.checkInDate &&
      res.checkOutDate
    ) {
      const start = new Date(res.checkInDate);
      const end = new Date(res.checkOutDate);
      res.numberOfNights = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
      );
    }
    if (res.numberOfGuests === 0 || !res.numberOfGuests) {
      res.numberOfGuests = 1; // Default for old reservations
    }
    return res;
  }

  async getAllReservations() {
    const reservations = await this.reservationRepository.find({
      relations: ["status"],
    });
    return reservations.map((res) => this.fixReservationData(res)!);
  }

  async getReservationById(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ["status"],
    });
    return this.fixReservationData(reservation);
  }

  async getReservationsByUserEmail(userEmail: string) {
    const reservations = await this.reservationRepository.find({
      where: { userEmail },
      relations: ["status"],
    });
    return reservations.map((res) => this.fixReservationData(res)!);
  }

  async getReservationsByRoomId(roomId: number) {
    const reservations = await this.reservationRepository.find({
      where: { roomId },
      relations: ["status"],
    });
    return reservations.map((res) => this.fixReservationData(res)!);
  }

  async createReservation(reservationData: any) {
    const reservation = this.reservationRepository.create(reservationData);
    return await this.reservationRepository.save(reservation);
  }

  async updateReservation(id: number, reservationData: any) {
    await this.reservationRepository.update(id, reservationData);
    return await this.getReservationById(id);
  }

  async cancelReservation(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });

    if (reservation && reservation.userEmail) {
      // Send Cancellation Email
      const emailServiceUrl =
        process.env.EMAIL_SERVICE_URL || "http://localhost:7011";

      const emailBody = `
        <h1>Reservation Cancellation Confirmation</h1>
        <p>Dear Customer,</p>
        <p>Your reservation has been successfully cancelled.</p>
        <p><strong>Reservation details:</strong></p>
        <ul>
            <li>Entry date: ${new Date(
              reservation.checkInDate
            ).toLocaleDateString()}</li>
            <li>Departure date: ${new Date(
              reservation.checkOutDate
            ).toLocaleDateString()}</li>
        </ul>
        <p>If you have any questions or need further assistance, please contact us.</p>
      `;

      try {
        const emailResponse = await fetch(
          `${emailServiceUrl}/api/emails/internal/send`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: reservation.userEmail,
              subject: "Reservation Cancellation Confirmation",
              body: emailBody,
            }),
          }
        );

        if (!emailResponse.ok) {
          const errorData = await emailResponse.text();
          console.error(
            `Failed to send cancellation email: ${emailResponse.status} - ${errorData}`
          );
        } else {
          // console.log(`Cancellation email sent to ${reservation.userEmail}`);
        }
      } catch (error: any) {
        console.error(`Failed to send cancellation email: ${error.message}`);
      }
    }

    await this.reservationRepository.update(id, {
      statusId: ReservationStatusEnum.CANCELLED,
    });
  }
}
