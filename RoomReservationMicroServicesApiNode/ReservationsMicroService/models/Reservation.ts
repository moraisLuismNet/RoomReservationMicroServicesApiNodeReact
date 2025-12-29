import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsNumber, IsDateString } from "class-validator";
import { ReservationStatus } from "./ReservationStatus";

// Enum for code convenience, but table uses IDs
export enum ReservationStatusEnum {
  PENDING = 1,
  CONFIRMED = 2,
  CHECKED_IN = 3,
  CHECKED_OUT = 4,
  CANCELLED = 5,
  PAID = 6,
}

@Entity("reservations")
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  roomId!: number;

  @Column()
  @IsNotEmpty()
  userEmail!: string;

  @Column()
  @IsNotEmpty()
  @IsDateString()
  checkInDate!: Date;

  @Column()
  @IsNotEmpty()
  @IsDateString()
  checkOutDate!: Date;

  @Column("decimal")
  @IsNotEmpty()
  @IsNumber()
  totalPrice!: number;

  @Column({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  numberOfNights!: number;

  @Column({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  numberOfGuests!: number;

  @Column({ name: "status_id", default: 1 })
  @IsNumber()
  statusId!: number;

  @ManyToOne(() => ReservationStatus, (status) => status.reservations)
  @JoinColumn({ name: "status_id" })
  status!: ReservationStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
