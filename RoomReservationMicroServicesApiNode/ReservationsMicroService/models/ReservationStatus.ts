import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { IsNotEmpty, IsEnum } from "class-validator";

import { Reservation } from "./Reservation";

export enum ReservationStatusName {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
  COMPLETED = "completed",
  PAID = "paid",
}

@Entity("reservation_statuses")
export class ReservationStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: ReservationStatusName,
    unique: true,
  })
  @IsNotEmpty()
  @IsEnum(ReservationStatusName)
  name!: ReservationStatusName;

  @Column({ type: "text", nullable: true })
  description?: string;

  @OneToMany(() => Reservation, (reservation) => reservation.status)
  reservations!: Reservation[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
