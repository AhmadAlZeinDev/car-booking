import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CarService } from './car.service';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/user/schemas/user.schema';
import { AddCarDto } from './dto/add-car.dto';
import { EditCarDto } from './dto/edit-car.dto';
import { GetCarsDto } from './dto/get-cars.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  //Add Car API
  @Post()
  @UseGuards(AuthGuard, new RoleGuard(Role.SUPER_USER))
  async addCar(@Body() body: AddCarDto) {
    const car = await this.carService.create(body);
    return { success: true, data: car };
  }

  //Edit Car Info API
  @Put(':id')
  @UseGuards(AuthGuard, new RoleGuard(Role.SUPER_USER))
  async editCar(@Param('id') id: string, @Body() body: EditCarDto) {
    await this.carService.update(id, body);
    return { success: true, data: 'Car edited successfully' };
  }

  //Get Cars with Pagination & Filtering API
  @Get()
  @UseGuards(AuthGuard)
  async getCars(@Query() query: GetCarsDto) {
    const [cars, pageSize, currentPage, totalPages, carsCount] =
      await this.carService.get(query);
    return {
      success: true,
      data: {
        cars,
        pageSize,
        currentPage,
        totalPages,
        carsCount,
      },
    };
  }

  //Get Car By ID API
  @Get(':id')
  @UseGuards(AuthGuard)
  async getCarById(@Param('id') id: string) {
    const car = await this.carService.getById(id);
    return { success: true, data: car };
  }
}
