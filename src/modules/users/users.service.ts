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
      const { password, username, role, plantId } = createUserDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        throw new HttpException('El nombre de usuario ya existe', HttpStatus.CONFLICT);
      }

      const hash = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          username,
          password: hash,
          role,
          plantId,
        },
      });

      return {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        plantId: newUser.plantId ? newUser.plantId : null,
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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

      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    try {
      const { password, username, role, plantId } = updateUserDto;
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
      const existingPlant = plantId ? await this.prisma.plant.findUnique({ where: { id: plantId } }) : null;
      if (plantId && !existingPlant) {
        throw new HttpException('Plant not found', HttpStatus.NOT_FOUND);
      }
      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          username: username ? username : existingUser.username,
          role: role ? role : existingUser.role,
          plantId: plantId ? plantId : existingUser.plantId,
          password: password ? await bcrypt.hash(password, 10) : existingUser.password,
        }
      })

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        plantId: updatedUser.plantId ? updatedUser.plantId : null,
      }

    } catch (error) {

      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async remove(id: number) {

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const removedUser = await this.prisma.user.delete({
        where: { id },
      });

      return removedUser

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }

  }
}
