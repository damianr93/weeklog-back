import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envs } from 'src/config/envs';


@Injectable()
export class WeatherApiAdapter {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService, 
) {
    this.baseUrl = 'http://api.weatherapi.com/v1';
  }

  async getCurrentWeather(lat: string, long:string): Promise<any> {
  
    const url = `${this.baseUrl}/current.json?key=${envs.API_WHEATHER}&q=${lat.replace(/,/g, ".")},${long.replace(/,/g, ".")}`;
  
    try {
      const response = await this.httpService.axiosRef.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el clima:', error.message);
      
      throw new Error('No se pudo obtener el clima. Intenta más tarde.'); 
    }
  }
}
