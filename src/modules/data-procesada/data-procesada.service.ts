import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class DataProcesadaService {
  constructor(private readonly prisma: PrismaService) { }

  async viajesPorChofer() {
    try {

      const viajes = await this.prisma.viajes.findMany({
        include: {
          chofer: {
            select: {
              name: true,
            },
          },
          destino: {
            select: {
              distancia_planta: true,
            },
          },
        },
      });

      const result = viajes.reduce((acc, viaje) => {
        // Si el chofer ya está en el resultado, lo actualizamos, si no, lo agregamos
        const chofer = acc.find(c => c.chofer === viaje.chofer.name);

        if (chofer) {
          chofer.cantidad += 1;
          chofer.totalKmRecorridos += viaje.kmRealesRecorridos || viaje.destino.distancia_planta;
        } else {
          acc.push({
            chofer: viaje.chofer.name,
            cantidad: 1,
            totalKmRecorridos: viaje.kmRealesRecorridos || viaje.destino.distancia_planta,
          });
        }

        return acc;
      }, []);

      return result;

    } catch (error) {

      return new HttpException(error.message, HttpStatus.BAD_REQUEST)

    }
  }
}