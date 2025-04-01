import { Injectable } from '@nestjs/common';
import { WeatherApiAdapter } from './apiWheather.adapter';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApiAdapter: WeatherApiAdapter) {}

  async getWeather(lat: string, long:string) {
    const weatherData = await this.weatherApiAdapter.getCurrentWeather(lat, long);
    return {
      temp: weatherData.current.temp_c,
      wind:weatherData.current.wind_kph,
      windDir: weatherData.current.wind_dir,
      condition: weatherData.current.condition,
    };
  }
}
