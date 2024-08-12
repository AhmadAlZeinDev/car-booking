import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from './schemas/car.schema';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Car',
        schema: CarSchema,
      },
    ]),
    UserModule,
    ConfigModule,
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
