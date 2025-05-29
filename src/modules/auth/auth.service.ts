import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string) {
    if (!username || !pass) {
      throw new UnauthorizedException('Username and password is required');
    }
    
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await bcrypt.compare(pass, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async signToken(payload: { sub: number; username: string; role: string; }) {
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }
}