import { Module } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { WeatherModule } from 'src/services/API-weather/apiWeather.module';
import { PrismaModule } from 'src/services/database-sql/prisma.module';
import { ProyeccionesService } from '../proyecciones/proyecciones.service';

@Module({
  imports: [WeatherModule, PrismaModule],
  controllers: [ViajesController],
  providers: [ViajesService, ProyeccionesService],
})
export class ViajesModule {}
