import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { WeatherService } from 'src/services/API-weather/apiWeather.service';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class ViajesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly weatherService: WeatherService,
  ) { }

  async create(createViajeDto: CreateViajeDto) {
    try {
      const nuevoViaje = await this.prisma.viajes.create({
        data: {
          createdByUser: { connect: { id: createViajeDto.created_by } },
          planta: { connect: { id: createViajeDto.planta } },
          destino: { connect: { id: createViajeDto.destino } },
          chofer: { connect: { id: createViajeDto.chofer } },
          fechaCarga: new Date(createViajeDto.fecha_carga),
          horaCarga: createViajeDto.hora_carga,
          kmRealesRecorridos: createViajeDto.km_recorridos || null,
          tiempoEstimadoCarga: createViajeDto.tiempo_carga || null,
          horaDescarga: createViajeDto.hora_descarga || null,
          horaRetorno: createViajeDto.hora_retorno || null,
          observaciones: createViajeDto.observaciones || null,
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
          planta:true,
          destino: true,
          chofer: true
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
          planta:true,
          destino: true,
          chofer: true
        },
      });

      return viaje

    } catch (error) {

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }


  }

  async update(id: string, updateViajeDto: UpdateViajeDto) {
    try {
      const updatedViaje = await this.prisma.viajes.update({
        where: { id: Number(id) },
        data: {
          createdByUser: updateViajeDto.created_by 
            ? { connect: { id: updateViajeDto.created_by } } 
            : undefined,
          planta: updateViajeDto.planta 
            ? { connect: { id: updateViajeDto.planta } } 
            : undefined,
          fechaCarga: updateViajeDto.fecha_carga 
            ? new Date(updateViajeDto.fecha_carga) 
            : undefined,
          horaCarga: updateViajeDto.hora_carga || undefined,
          kmRealesRecorridos: updateViajeDto.km_recorridos !== undefined 
            ? updateViajeDto.km_recorridos 
            : null,
          tiempoEstimadoCarga: updateViajeDto.tiempo_carga !== undefined 
            ? updateViajeDto.tiempo_carga 
            : null,
          horaDescarga: updateViajeDto.hora_descarga || null,
          horaRetorno: updateViajeDto.hora_retorno || null,
          observaciones: updateViajeDto.observaciones || null,
          destino: updateViajeDto.destino 
            ? { connect: { id: updateViajeDto.destino } } 
            : undefined,
          chofer: updateViajeDto.chofer 
            ? { connect: { id: updateViajeDto.chofer } } 
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

      return removedViaje

    } catch (error) {

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }
  }
}