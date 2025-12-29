import { IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { ReservationStatusName } from "../models/ReservationStatus";

export class CreateReservationStatusDto {
  @IsNotEmpty()
  @IsEnum(ReservationStatusName)
  name!: ReservationStatusName;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateReservationStatusDto {
  @IsOptional()
  @IsEnum(ReservationStatusName)
  name?: ReservationStatusName;

  @IsOptional()
  @IsString()
  description?: string;
}
