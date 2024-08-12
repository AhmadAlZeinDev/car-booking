import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Role } from 'src/user/schemas/user.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly role: Role) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const role = request.user.role;

    if (role == this.role) return true;

    //Otherwise; not authorized
    throw new HttpException('Not Allowed', HttpStatus.FORBIDDEN);
  }
}
