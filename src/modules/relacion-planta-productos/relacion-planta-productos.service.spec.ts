import { Test, TestingModule } from '@nestjs/testing';
import { RelacionPlantaProductosService } from './relacion-planta-productos.service';

describe('RelacionPlantaProductosService', () => {
  let service: RelacionPlantaProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelacionPlantaProductosService],
    }).compile();

    service = module.get<RelacionPlantaProductosService>(RelacionPlantaProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
