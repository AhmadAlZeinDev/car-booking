import { IsIn } from 'class-validator';
import { BookingStatus } from '../schemas/booking.schema';

export class UpdateBookingDto {
  @IsIn([
    BookingStatus.CANCELLED,
    BookingStatus.CONFIRMED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
  ])
  status: BookingStatus;
}
