import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class EditCarDto {
  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  carModel?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  mileAge?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  pricePerDay?: number;
}
