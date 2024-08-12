import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Role, User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly sharedService: SharedService,
  ) {}

  async seed() {
    const checkSuperUser = await this.userModel.findOne({
      email: 'tarek.kabrit@gmail.com', //CEO's fake email
    });
    if (!checkSuperUser) {
      await this.userModel.create({
        name: 'Tarek Kabrit',
        email: 'tarek.kabrit@gmail.com',
        password: await this.sharedService.hashPassword('T@rek12345'),
        address: 'Gate Avenue, DIFC, Dubai UAE',
        role: Role.SUPER_USER,
      });
    }
  }
}
