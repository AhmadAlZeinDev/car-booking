import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  sortBy: string;
}
