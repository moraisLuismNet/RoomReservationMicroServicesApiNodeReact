import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
} from "class-validator";
import { UserRole } from "../models/User";

export class RegisterDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
