import { Module } from '@nestjs/common';
import { PlantaService } from './planta.service';
import { PlantaController } from './planta.controller';
import { PrismaModule } from 'src/services/database-sql/prisma.module';
import { WeatherModule } from 'src/services/API-weather/apiWeather.module';

@Module({
  imports: [WeatherModule, PrismaModule],
  controllers: [PlantaController],
  providers: [PlantaService],
})
export class PlantaModule {}
