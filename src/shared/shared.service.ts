import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class SharedService {
  constructor(private readonly configService: ConfigService) {}
  async hashPassword(password: string) {
    const salt = this.configService.get<number>('SALT');
    const generatedSalt = await genSalt(+salt);
    return await hash(password, generatedSalt);
  }
}
