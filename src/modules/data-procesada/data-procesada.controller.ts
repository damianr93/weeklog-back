import { Controller, Get } from '@nestjs/common';
import { DataProcesadaService } from './data-procesada.service';


@Controller('data-procesada')
export class DataProcesadaController {
  constructor(private readonly dataProcesadaService: DataProcesadaService) {}

  @Get('viajesporchofer')
  findViajesPorChofer() {
    return this.dataProcesadaService.viajesPorChofer();
  }
}
