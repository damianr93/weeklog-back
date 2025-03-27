import { Test, TestingModule } from '@nestjs/testing';
import { DataProcesadaController } from './data-procesada.controller';
import { DataProcesadaService } from './data-procesada.service';

describe('DataProcesadaController', () => {
  let controller: DataProcesadaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataProcesadaController],
      providers: [DataProcesadaService],
    }).compile();

    controller = module.get<DataProcesadaController>(DataProcesadaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
