import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/constants/key-decorators';
import { IUseToken } from 'src/interfaces/auth.interfaces';
import { useToken } from 'src/utils/useToken';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    // Verificar con el que contenga el decorador PUBLIC
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    // Verificar Que contenga el token en header
    const req = context.switchToHttp().getRequest<Request>();

    const token = req.headers['token'];

    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Invalid Token');
    }

    // Verificar token este
    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExpired) {
      throw new UnauthorizedException('Token Expired');
    }

    const { sub } = manageToken;

    // Verificar usuario
    const user = await this.userService.findUser(sub);

    if (!user) {
      throw new UnauthorizedException('Invalid User');
    }

    req.idUser = user.id;
    req.roleUser = user.role;
    return true;
  }
}
