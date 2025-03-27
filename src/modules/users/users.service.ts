import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, username, role, plantaId } = createUserDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        throw new HttpException('El nombre de usuario ya existe', HttpStatus.CONFLICT);
      }

      const hash = await bcrypt.hash(password, 10);

      return this.prisma.user.create({
        data: {
          username,
          password: hash,
          role,
          plantaId, 
        },
      });

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    try {

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      return updatedUser

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  async remove(id: number) {

    try {

      const removedUser = await this.prisma.user.delete({
        where: { id },
      });

      return removedUser

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }

  }
}
