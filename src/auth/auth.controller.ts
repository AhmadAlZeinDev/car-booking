import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { Payload } from 'src/common/types/payload';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    await this.userService.create(body);
    return { success: true, data: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.userService.getForLogin(body.email, body.password);
    const payload: Payload = {
      id: user._id.toString(),
      password: user.password,
    };
    const token = await this.authService.signPayload(payload);
    const userInfo = { ...user.toObject(), password: undefined };
    return { success: true, data: userInfo, token };
  }
}
