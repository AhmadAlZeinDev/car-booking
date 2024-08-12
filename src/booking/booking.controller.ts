import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { AddBookingDto } from './dto/add-booking.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/user/schemas/user.schema';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { GetBookingsDto } from './dto/get-bookings.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  //Book Car API
  @Post(':carId')
  @UseGuards(AuthGuard, new RoleGuard(Role.CUSTOMER))
  async bookCar(
    @Request() req: any,
    @Param('carId') carId: string,
    @Body() body: AddBookingDto,
  ) {
    const booking = await this.bookingService.create(req.user._id, carId, body);
    return { success: true, data: booking };
  }

  //Update Booking API
  @Put('update/:id')
  @UseGuards(AuthGuard, new RoleGuard(Role.SUPER_USER))
  async updateBooking(@Param('id') id: string, @Body() body: UpdateBookingDto) {
    await this.bookingService.update(id, body.status);
    return { success: true, data: 'Booking updated successfully' };
  }

  //Cancel Booking API
  @Put('cancel/:id')
  @UseGuards(AuthGuard, new RoleGuard(Role.CUSTOMER))
  async cancelBooking(@Request() req: any, @Param('id') id: string) {
    await this.bookingService.checkIfAllowed(id, req.user._id);
    await this.bookingService.cancel(id);
    return { success: true, data: 'Booking cancelled successfully' };
  }

  //Get Bookings By Super User API
  @Get()
  @UseGuards(AuthGuard, new RoleGuard(Role.SUPER_USER))
  async getBookings(@Query() query: GetBookingsDto) {
    const [bookings, pageSize, currentPage, totalPages, bookingsCount] =
      await this.bookingService.getBySuperUser(query);
    return {
      success: true,
      data: {
        bookings,
        pageSize,
        currentPage,
        totalPages,
        bookingsCount,
      },
    };
  }

  //Get Bookings By Customer API
  @Get('me')
  @UseGuards(AuthGuard, new RoleGuard(Role.CUSTOMER))
  async getMyBookings(@Request() req: any, @Query() query: PaginationQueryDto) {
    const [bookings, pageSize, currentPage, totalPages, bookingsCount] =
      await this.bookingService.getByCustomer(req.user._id, query);
    return {
      success: true,
      data: {
        bookings,
        pageSize,
        currentPage,
        totalPages,
        bookingsCount,
      },
    };
  }

  //Get Booking By ID By Super User API
  @Get(':id/super-user')
  @UseGuards(AuthGuard, new RoleGuard(Role.SUPER_USER))
  async getBookingByIDBySuperUser(@Param('id') id: string) {
    const booking = await this.bookingService.getById(id);
    return { success: true, data: booking };
  }

  //Get Booking By ID By Customer API
  @Get(':id/customer')
  @UseGuards(AuthGuard, new RoleGuard(Role.CUSTOMER))
  async getBookingByIDByCustomer(@Request() req: any, @Param('id') id: string) {
    await this.bookingService.checkIfAllowed(id, req.user._id);
    const booking = await this.bookingService.getById(id);
    return { success: true, data: booking };
  }
}
