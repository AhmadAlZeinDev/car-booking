import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { SharedService } from 'src/shared/shared.service';
import { ConfigModule } from '@nestjs/config';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, SharedService, UserSeedService],
  exports: [UserService, UserSeedService],
})
export class UserModule {}
