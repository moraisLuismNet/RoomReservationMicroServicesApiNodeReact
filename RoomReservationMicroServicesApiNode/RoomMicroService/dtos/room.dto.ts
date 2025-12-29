import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  roomNumber!: string;

  @IsNotEmpty()
  @IsNumber()
  roomTypeId!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  imageRoom?: string;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsNumber()
  roomTypeId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  imageRoom?: string;
}
