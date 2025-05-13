import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { WeatherService } from 'src/services/API-weather/apiWeather.service';
import { PrismaService } from 'src/services/database-sql/prisma.service';
import { ProyeccionesService } from '../proyecciones/proyecciones.service';

@Injectable()
export class ViajesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly proyeccionesSercive: ProyeccionesService,
    private readonly weatherService: WeatherService,
  ) { }

  async create(createViajeDto: CreateViajeDto) {

    try {
      const nuevoViaje = await this.prisma.viajes.create({
        data: {
          createdByUser: { connect: { id: createViajeDto.createdByUserId } },
          planta: { connect: { id: createViajeDto.plantaId } },
          destino: { connect: { id: createViajeDto.destinoId } },
          chofer: { connect: { id: createViajeDto.choferId } },
          horarioRetiro: { connect: { id: createViajeDto.horarioRetiroId } },
          kmRealesRecorridos: createViajeDto.kmRealesRecorridos || null,
          tiempoEstimadoCarga: createViajeDto.tiempoEstimadoCarga || null,
          horaDescarga: createViajeDto.horaDescarga || null,
          horaRetorno: createViajeDto.horaRetorno || null,
          observaciones: createViajeDto.observaciones || null,
        }
      });


      await this.prisma.horarioRetiro.update({
        where: { id: createViajeDto.horarioRetiroId },
        data: {
          viajeId: nuevoViaje.id,
          disponible: false
        }
      });


      return nuevoViaje;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const viajes = await this.prisma.viajes.findMany({
        include: {
          createdByUser: true,
          planta: true,
          destino: true,
          chofer: true,
          horarioRetiro:true
        },
      });

      const destinosConClima = await Promise.all(
        viajes.map(async (viaje: any) => {
          const { lat, lng } = viaje.destino;

          const weather = await this.weatherService.getWeather(`${lat}`, `${lng}`);

          return { ...viaje, ...weather };
        })
      );

      return destinosConClima;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: string) {
    try {
      const viaje = await this.prisma.viajes.findUnique({
        where: { id: Number(id) },
        include: {
          createdByUser: true,
          planta: true,
          destino: true,
          chofer: true,
          horarioRetiro:true
        },
      });

      return viaje;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: string, updateViajeDto: UpdateViajeDto) {
    try {
      const updatedViaje = await this.prisma.viajes.update({
        where: { id: Number(id) },
        data: {
          createdByUser: updateViajeDto.createdByUserId
            ? { connect: { id: updateViajeDto.createdByUserId } }
            : undefined,
          planta: updateViajeDto.plantaId
            ? { connect: { id: updateViajeDto.plantaId } }
            : undefined,
          kmRealesRecorridos: updateViajeDto.kmRealesRecorridos !== undefined
            ? updateViajeDto.kmRealesRecorridos
            : null,
          tiempoEstimadoCarga: updateViajeDto.tiempoEstimadoCarga !== undefined
            ? updateViajeDto.tiempoEstimadoCarga
            : null,
          horaDescarga: updateViajeDto.horaDescarga || null,
          horaRetorno: updateViajeDto.horaRetorno || null,
          observaciones: updateViajeDto.observaciones || null,
          destino: updateViajeDto.destinoId
            ? { connect: { id: updateViajeDto.destinoId } }
            : undefined,
          chofer: updateViajeDto.choferId
            ? { connect: { id: updateViajeDto.choferId } }
            : undefined,
        },
        include: {
          createdByUser: true,
          planta: true,
          destino: true,
          chofer: true,
        },
      });

      return updatedViaje;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const removedViaje = await this.prisma.viajes.delete({
        where: { id: Number(id) },
      });

      await this.prisma.horarioRetiro.update({
        where: { id: removedViaje.horarioRetiroId },
        data: {
          viajeId: null,
          disponible: true
        }
      });

      return removedViaje;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
