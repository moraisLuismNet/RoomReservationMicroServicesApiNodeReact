import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator";
import { RoomType } from "./RoomType";

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn()
  roomId!: number;

  @Column({ name: "room_number", length: 10, unique: true })
  @IsNotEmpty()
  @IsString()
  roomNumber!: string;

  @Column({ name: "room_type_id" })
  @IsNotEmpty()
  @IsNumber()
  roomTypeId!: number;

  @Column({ name: "is_active", default: true })
  @IsBoolean()
  isActive!: boolean;

  @Column({ name: "image_room", length: 2048, nullable: true })
  imageRoom?: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn({ name: "room_type_id" })
  roomType!: RoomType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
