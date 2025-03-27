import {
  HttpException,
  HttpStatus,
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
  ) {}

  async signIn(username: string, pass: string): Promise<any> {

    try {

      const user = await this.prisma.user.findUnique({
        where: { username },
        include:{
          planta:true
        } 
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const isMatching = await bcrypt.compare(pass, user.password);
      if (!isMatching) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const access_token = await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
        role: user.role,
        expires: '1h'
      });
  
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        planta: user.planta,
        access_token,
      };
    
      
    } catch (error) {
    
      return new HttpException(error.message, HttpStatus.BAD_REQUEST)
      
    }
  } 
    
}
