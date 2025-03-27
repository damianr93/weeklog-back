import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChoferDto } from './dto/create-chofere.dto';
import { PrismaService } from 'src/services/database-sql/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateChofereDto } from './dto/update-chofere.dto';

@Injectable()
export class ChoferesService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createChofereDto: CreateChoferDto) {
    try {
      const chofer = await this.prisma.chofer.create({
        data: {
          createdByUserId: createChofereDto.createdByUserId,
          name: createChofereDto.name,
          lastName: createChofereDto.lastName,
          celular: createChofereDto.celular,
          plantaHabitualId: createChofereDto.plantaHabitualId ?? null,
        }
      });

      return chofer;
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        if (error.code === 'P2002') {
          throw new HttpException(
            'Ya existe un chofer con estos datos',
            HttpStatus.CONFLICT
          );
        }
      }
      throw new HttpException(
        `Error de base de datos: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll() {
    try {
      const choferes = await this.prisma.chofer.findMany({
        include: {
          createdByUser: {
            select: {
              id: true,
              username: true,
              role: true
            }
          },
          plantaHabitual: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return choferes;
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        error.message || 'Error al recuperar choferes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: number) {
    try {
      const chofer = await this.prisma.chofer.findUnique({
        where: { id },
        include: {
          createdByUser: {
            select: {
              id: true,
              username: true,
              role: true
            }
          },
          plantaHabitual: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

      if (!chofer) {
        throw new HttpException(
          `Chofer con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND
        );
      }

      return chofer;
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error al recuperar chofer',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, updateChofereDto: UpdateChofereDto) {
    try {

      const existingChofer = await this.prisma.chofer.findUnique({
        where: { id }
      });

      if (!existingChofer) {
        throw new HttpException(
          `Chofer con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND
        );
      }

      const updatedChofer = await this.prisma.chofer.update({
        where: { id },
        data: {
          name: updateChofereDto.name,
          lastName: updateChofereDto.lastName,
          celular: updateChofereDto.celular,
          plantaHabitual: updateChofereDto.plantaHabitualId
            ? { connect: { id: updateChofereDto.plantaHabitualId } }
            : undefined,
        },
        include: {
          createdByUser: true,
          plantaHabitual: true
        }
      });

      return updatedChofer;
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        if (error.code === 'P2025') {
          throw new HttpException(
            `Chofer con ID ${id} no encontrado`,
            HttpStatus.NOT_FOUND
          );
        }

        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error al actualizar chofer',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number) {
    try {

      const existingChofer = await this.prisma.chofer.findUnique({
        where: { id }
      });

      if (!existingChofer) {
        throw new HttpException(
          `Chofer con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND
        );
      }

      const viajesCount = await this.prisma.viajes.count({
        where: { choferId: id }
      });

      if (viajesCount > 0) {
        throw new HttpException(
          `No se puede eliminar el chofer. Tiene ${viajesCount} viaje(s) asociado(s)`,
          HttpStatus.CONFLICT
        );
      }

      const removedChofer = await this.prisma.chofer.delete({
        where: { id },
        include: {
          createdByUser: true,
          plantaHabitual: true
        }
      });

      return removedChofer;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        if (error.code === 'P2025') {
          throw new HttpException(
            `Chofer con ID ${id} no encontrado`,
            HttpStatus.NOT_FOUND
          );
        }

        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error al eliminar chofer',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}