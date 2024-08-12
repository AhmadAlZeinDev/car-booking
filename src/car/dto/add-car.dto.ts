import { IsNumber, IsPositive, IsString } from 'class-validator';

export class AddCarDto {
  @IsString()
  make: string;

  @IsString()
  carModel: string;

  @IsNumber()
  year: number;

  @IsNumber()
  mileAge: number;

  @IsNumber()
  @IsPositive()
  pricePerDay: number;
}
