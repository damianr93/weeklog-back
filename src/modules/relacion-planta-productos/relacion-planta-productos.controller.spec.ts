import { Test, TestingModule } from '@nestjs/testing';
import { RelacionPlantaProductosController } from './relacion-planta-productos.controller';
import { RelacionPlantaProductosService } from './relacion-planta-productos.service';

describe('RelacionPlantaProductosController', () => {
  let controller: RelacionPlantaProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelacionPlantaProductosController],
      providers: [RelacionPlantaProductosService],
    }).compile();

    controller = module.get<RelacionPlantaProductosController>(RelacionPlantaProductosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
