import { IsNotEmpty, IsNumber, IsDateString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  roomId!: number;

  @IsNotEmpty()
  @IsDateString()
  checkInDate!: string;

  @IsNotEmpty()
  @IsDateString()
  checkOutDate!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalPrice!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  numberOfNights!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  numberOfGuests!: number;
}
