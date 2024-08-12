import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword()
  @IsString()
  password: string;

  @IsString()
  address: string;
}
