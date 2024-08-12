import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
      const decodedToken = verify(token, secretKey);

      const user = await this.userService.getWithPassword(decodedToken['id']);

      // Check if password changed or not (I know that changing password functionality doesn't exist)
      if (user.password !== decodedToken?.['password'])
        throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);

      request.user = user;

      return true;
    } catch (error) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
