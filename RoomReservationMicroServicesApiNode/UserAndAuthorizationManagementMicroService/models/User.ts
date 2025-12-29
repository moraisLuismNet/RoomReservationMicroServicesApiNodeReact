import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, IsEnum } from "class-validator";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity("users")
export class User {
  @PrimaryColumn({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column()
  @IsNotEmpty()
  name!: string;

  @Column({ select: false })
  @IsNotEmpty()
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
