import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Booking, BookingStatus } from './schemas/booking.schema';
import { AddBookingDto } from './dto/add-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CarService } from 'src/car/car.service';
import { GetBookingsDto } from './dto/get-bookings.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: Model<Booking>,
    private readonly carService: CarService,
  ) {}

  async create(userId: string, carId: string, input: AddBookingDto) {
    const car = await this.carService.getById(carId);

    //Check if car is available
    const checkBooking = await this.bookingModel.findOne({
      car: carId,
      $or: [
        {
          startDate: { $lt: input.endDate },
          endDate: { $gt: input.startDate },
        },
        { startDate: { $gte: input.startDate, $lt: input.endDate } },
        { endDate: { $gt: input.startDate, $lte: input.endDate } },
      ],
    });
    if (checkBooking)
      throw new HttpException('Car is not available', HttpStatus.BAD_REQUEST);

    //Calculate Total Price
    const pricePerDay = car.pricePerDay;
    const durationInDays =
      (input.endDate.getTime() - input.startDate.getTime()) /
      (1000 * 60 * 60 * 24);
    const totalPrice = durationInDays * pricePerDay;

    const booking = await this.bookingModel.create({
      user: userId,
      car: carId,
      ...input,
      totalPrice,
      status: BookingStatus.PENDING,
    });
    return booking;
  }

  async update(id: string, status: BookingStatus) {
    const booking = await this.getById(id);

    //If Cancellation
    if (
      status === BookingStatus.CANCELLED &&
      booking.status !== BookingStatus.PENDING
    )
      throw new HttpException(
        'Booking cannot be cancelled',
        HttpStatus.BAD_REQUEST,
      );

    //If Confirmation
    if (
      status === BookingStatus.CONFIRMED &&
      booking.status !== BookingStatus.PENDING
    )
      throw new HttpException(
        'Booking cannot be confirmed',
        HttpStatus.BAD_REQUEST,
      );

    //If switching to In Progress
    if (
      status === BookingStatus.IN_PROGRESS &&
      booking.status !== BookingStatus.CONFIRMED
    )
      throw new HttpException(
        'Booking should be confirmed first',
        HttpStatus.BAD_REQUEST,
      );

    //If Completing
    if (
      status === BookingStatus.COMPLETED &&
      booking.status !== BookingStatus.IN_PROGRESS
    )
      throw new HttpException(
        'Booking cannot be completed',
        HttpStatus.BAD_REQUEST,
      );

    booking.status = status;
    if (status === BookingStatus.CANCELLED) booking.cancelledAt = new Date();
    await booking.save();
  }

  async cancel(id: string) {
    const booking = await this.getById(id);

    // Check if the booking is pending and if the booking is cancelled within the first 24 hours of booking
    const now = new Date();
    const hoursDifference =
      Math.abs(now.getTime() - booking['createdAt'].getTime()) / 36e5;
    if (booking.status !== BookingStatus.PENDING || hoursDifference < 24)
      throw new HttpException(
        'Booking cannot be cancelled',
        HttpStatus.BAD_REQUEST,
      );

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = now;
    await booking.save();
  }

  async getById(id: string) {
    const booking = await this.bookingModel.findById(id).populate('user car');

    if (!booking)
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);

    return booking;
  }

  async getBySuperUser(filter: GetBookingsDto) {
    const [sortBy, sortOption] = filter.sortBy.split(',');
    const conditions = {
      ...(filter.carId && { car: filter.carId }),
      ...(filter.userId && { user: new Types.ObjectId(filter.userId) }),
      ...(filter.status && { status: filter.status }),
      ...((filter.fromStart || filter.toStart) && {
        startDate: {
          ...(filter.fromStart && { $gte: filter.fromStart }),
          ...(filter.toStart && { $lte: filter.toStart }),
        },
      }),
      ...((filter.fromEnd || filter.toEnd) && {
        endDate: {
          ...(filter.fromEnd && { $gte: filter.fromEnd }),
          ...(filter.toEnd && { $lte: filter.toEnd }),
        },
      }),
    };
    const bookingsCount = await this.bookingModel.countDocuments(conditions);
    const bookings = await this.bookingModel
      .find(conditions)
      .populate('user car')
      .sort({
        [sortBy]: sortOption == 'desc' ? -1 : 1,
      })
      .skip(filter.limit * (filter.page - 1))
      .limit(filter.limit);
    return [
      bookings,
      filter.limit,
      filter.page,
      Math.ceil(bookingsCount / filter.limit),
      bookingsCount,
    ];
  }

  async getByCustomer(userId: string, filter: PaginationQueryDto) {
    const [sortBy, sortOption] = filter.sortBy.split(',');
    const conditions = {
      user: userId,
    };
    const bookingsCount = await this.bookingModel.countDocuments(conditions);
    const bookings = await this.bookingModel
      .find(conditions)
      .populate('car')
      .sort({
        [sortBy]: sortOption == 'desc' ? -1 : 1,
      })
      .skip(filter.limit * (filter.page - 1))
      .limit(filter.limit);
    return [
      bookings,
      filter.limit,
      filter.page,
      Math.ceil(bookingsCount / filter.limit),
      bookingsCount,
    ];
  }

  async checkIfAllowed(id: string, userId: string) {
    const booking = await this.getById(id);
    if (booking.user['_id'].toString() != userId)
      throw new HttpException('Not Allowed', HttpStatus.FORBIDDEN);
  }
}
