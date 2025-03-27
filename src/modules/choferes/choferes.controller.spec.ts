import { Test, TestingModule } from '@nestjs/testing';
import { ChoferesController } from './choferes.controller';
import { ChoferesService } from './choferes.service';

describe('ChoferesController', () => {
  let controller: ChoferesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoferesController],
      providers: [ChoferesService],
    }).compile();

    controller = module.get<ChoferesController>(ChoferesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
