import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User } from './schemas/user.schema';
import { compare } from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly sharedService: SharedService,
  ) {}

  async create(input: RegisterDto) {
    await this.checkEmailUniqueness(input.email);
    await this.userModel.create({
      ...input,
      password: await this.sharedService.hashPassword(input.password),
      role: Role.CUSTOMER,
    });
    //Here the logic for email validation & sending otp should be added
  }

  async getForLogin(email: string, password: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .select('+password');

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (!(await compare(password, user.password))) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async getWithPassword(id: string) {
    const user = await this.userModel
      .findOne({
        _id: id,
      })
      .select('+password');

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async checkEmailUniqueness(email: string) {
    const checkUser = await this.userModel.findOne({
      email,
    });
    if (checkUser)
      throw new HttpException('Email already used', HttpStatus.BAD_REQUEST);
  }
}
