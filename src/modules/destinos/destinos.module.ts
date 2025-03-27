import { Module } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { WeatherModule } from 'src/services/API-weather/apiWeather.module';
import { PrismaModule } from 'src/services/database-sql/prisma.module';

@Module({
  imports: [ WeatherModule, PrismaModule],
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}
