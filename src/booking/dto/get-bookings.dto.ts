import { IsDate, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BookingStatus } from '../schemas/booking.schema';

export class GetBookingsDto extends PaginationQueryDto {
  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsMongoId()
  @IsOptional()
  carId?: string;

  @IsDate()
  @IsOptional()
  fromStart?: Date;

  @IsDate()
  @IsOptional()
  toStart?: Date;

  @IsDate()
  @IsOptional()
  fromEnd?: Date;

  @IsDate()
  @IsOptional()
  toEnd?: Date;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
