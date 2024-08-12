import { Injectable } from '@nestjs/common';
import { Payload } from 'src/common/types/payload';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  async signPayload(payload: Payload) {
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const expiry = this.configService.get<string>('JWT_EXPIRY');
    return sign(payload, secretKey, {
      expiresIn: expiry,
    });
  }
}
