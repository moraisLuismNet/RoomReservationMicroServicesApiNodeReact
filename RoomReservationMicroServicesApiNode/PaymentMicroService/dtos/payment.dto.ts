import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  IsOptional,
} from "class-validator";

export class CreatePaymentIntentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsNotEmpty()
  @IsNumber()
  reservationId!: number;
}

export class CreateCheckoutSessionDto {
  @IsNotEmpty()
  @IsNumber()
  reservationId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsNotEmpty()
  @IsString()
  currency!: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  @IsString()
  productDescription?: string;

  @IsNotEmpty()
  @IsString()
  userEmail!: string;
}
