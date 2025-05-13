import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from './interface/auth.interface';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector
  ) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.get<boolean>(
      'PUBLIC',
      context.getHandler()
    )

    if (isPublic) {
      return true
    }

    const req = context.switchToHttp().getRequest();

    // Verificar tanto el header como la cookie
    let token = req.headers['codrr_token'];
    
    // Si no hay token en el header, verificar en las cookies
    if (!token || Array.isArray(token)) {
      token = req.cookies?.Authentication;

      // Si tampoco hay cookie válida
      if (!token) {
        throw new UnauthorizedException('Token no proporcionado');
      }
    }

    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExpires) {
      throw new UnauthorizedException('Token expirado');
    }

    const { sub } = manageToken;

    const user = await this.prisma.user.findUnique({ where: { id: sub } });

    if (!user) {
      throw new UnauthorizedException('Usuario inválido');
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    return true;
  }
}