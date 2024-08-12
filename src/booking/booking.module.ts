import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './schemas/booking.schema';
import { CarModule } from 'src/car/car.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Booking',
        schema: BookingSchema,
      },
    ]),
    CarModule,
    UserModule,
    ConfigModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
