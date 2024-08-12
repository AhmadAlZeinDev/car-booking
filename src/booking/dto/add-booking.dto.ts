import { IsDate } from 'class-validator';
import { IsEndDateAfterStartDate } from '../../common/decorators/endDateAfterstartDate.decorator';

export class AddBookingDto {
  @IsDate()
  startDate: Date;

  @IsDate()
  @IsEndDateAfterStartDate('startDate', {
    message: 'Invalid date range',
  })
  endDate: Date;
}
