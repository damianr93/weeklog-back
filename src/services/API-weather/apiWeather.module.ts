import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WeatherService } from './apiWeather.service';
import { WeatherApiAdapter } from './apiWheather.adapter';


@Module({
  imports: [HttpModule, ConfigModule],
  providers: [WeatherService, WeatherApiAdapter],
  exports: [WeatherService],
})
export class WeatherModule {}
