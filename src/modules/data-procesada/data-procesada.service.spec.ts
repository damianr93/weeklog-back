import { Test, TestingModule } from '@nestjs/testing';
import { DataProcesadaService } from './data-procesada.service';

describe('DataProcesadaService', () => {
  let service: DataProcesadaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataProcesadaService],
    }).compile();

    service = module.get<DataProcesadaService>(DataProcesadaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
