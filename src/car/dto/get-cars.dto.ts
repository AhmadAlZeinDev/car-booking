import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class GetCarsDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string = '';

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
  @IsPositive()
  @IsOptional()
  fromPrice?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  toPrice?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  fromMileAge?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  toMileAge?: number;
}
