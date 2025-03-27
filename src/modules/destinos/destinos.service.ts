import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { WeatherService } from 'src/services/API-weather/apiWeather.service';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class DestinosService {

  constructor(
    private prisma: PrismaService,
    private readonly weatherService: WeatherService,
  ) { }

  async create(createDestinoDto: CreateDestinoDto) {
    try {
      const nuevoDestino = await this.prisma.destino.create({
        data: {
          createdByUser: { connect: { id: createDestinoDto.createdByUserId } },
          name: createDestinoDto.name,
          condicionesEntrada: createDestinoDto.condicionesEntrada,
          lat: +createDestinoDto.lat,
          lng: +createDestinoDto.lng,
          distancia_planta: createDestinoDto.distancia_planta,
          frecuenciaConsumo: createDestinoDto.frecuenciaConsumo,
          estimaProximoConsumo: createDestinoDto.estimaProximoConsumo,
        }
      });

      return nuevoDestino;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {

      const destinos = await this.prisma.destino.findMany({
        include: {
          createdByUser: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
      });

      const destinosConClima = await Promise.all(
        destinos.map(async (destino) => {
          const { lat, lng } = destino;
          const weather = await this.weatherService.getWeather(`${lat}`, `${lng}`);

          return { ...destino, clima: weather };
        }),
      );

      return destinosConClima;

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: number) {

    try {

      const destino = await this.prisma.destino.findUnique({
        where: { id },
        include: {
          createdByUser: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
      });

      if (!destino) {
        throw new Error('Destino no encontrado');
      }

      return destino;

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }
  }

  async update(id: number, updateDestinoDto: any) {

    try {

      const destino = await this.prisma.destino.findUnique({
        where: { id: Number(id) },
      });

      if (!destino) {
        throw new NotFoundException(`Destino with ID ${id} not found`);
      }

      return this.prisma.destino.update({
        where: { id: Number(id) },
        data: updateDestinoDto,
      });

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }
  }

  async remove(id: number) {

    try {

      const removedDestino = await this.prisma.destino.delete({
        where: { id },
      });

      return removedDestino

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }

  }
}
