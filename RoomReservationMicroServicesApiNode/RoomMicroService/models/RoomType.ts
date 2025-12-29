import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Room } from "./Room";

@Entity("room_types")
export class RoomType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name", unique: true })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  @Column({ name: "price_per_night", type: "decimal", precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  pricePerNight!: number;

  @Column({ name: "capacity", type: "integer" })
  @IsNotEmpty()
  @IsNumber()
  capacity!: number;

  @OneToMany(() => Room, (room) => room.roomType)
  rooms!: Room[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
