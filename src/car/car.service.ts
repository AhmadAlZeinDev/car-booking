import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Car } from './schemas/car.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AddCarDto } from './dto/add-car.dto';
import { GetCarsDto } from './dto/get-cars.dto';
import { EditCarDto } from './dto/edit-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectModel('Car')
    private readonly carModel: Model<Car>,
  ) {}

  async create(input: AddCarDto) {
    const car = await this.carModel.create({
      ...input,
    });
    return car;
  }

  async update(id: string, input: EditCarDto) {
    await this.getById(id);
    await this.carModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...input,
        },
      },
    );

    //Notify all pending and confirmed bookings' users that there is a change in the car
  }

  async getById(id: string) {
    const car = await this.carModel.findById(id);

    if (!car) throw new HttpException('Car not found', HttpStatus.NOT_FOUND);

    return car;
  }

  async get(filter: GetCarsDto) {
    const [sortBy, sortOption] = filter.sortBy.split(',');
    const conditions = {
      $or: [
        {
          make: { $regex: filter.search, $options: 'i' },
        },
        {
          carModel: { $regex: filter.search, $options: 'i' },
        },
      ],
      ...(filter.year && { year: filter.year }),
      ...((filter.fromPrice || filter.toPrice) && {
        pricePerDay: {
          ...(filter.fromPrice && { $gte: filter.fromPrice }),
          ...(filter.toPrice && { $lte: filter.toPrice }),
        },
      }),
      ...((filter.fromMileAge || filter.toMileAge) && {
        mileAge: {
          ...(filter.fromMileAge && { $gte: filter.fromMileAge }),
          ...(filter.toMileAge && { $lte: filter.toMileAge }),
        },
      }),
    };
    const carsCount = await this.carModel.countDocuments(conditions);
    const cars = await this.carModel
      .find(conditions)
      .sort({
        [sortBy]: sortOption == 'desc' ? -1 : 1,
      })
      .skip(filter.limit * (filter.page - 1))
      .limit(filter.limit);
    return [
      cars,
      filter.limit,
      filter.page,
      Math.ceil(carsCount / filter.limit),
      carsCount,
    ];
  }
}
