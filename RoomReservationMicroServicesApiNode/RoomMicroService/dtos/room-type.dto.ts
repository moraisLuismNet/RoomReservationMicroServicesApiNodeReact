import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoomTypeDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  pricePerNight!: number;

  @IsNotEmpty()
  @IsNumber()
  capacity!: number;
}

export class UpdateRoomTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  pricePerNight?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;
}
