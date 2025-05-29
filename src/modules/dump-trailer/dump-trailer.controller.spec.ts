import { Test, TestingModule } from '@nestjs/testing';
import { DumpTrailerController } from './dump-trailer.controller';
import { DumpTrailerService } from './dump-trailer.service';

describe('DumpTrailerController', () => {
  let controller: DumpTrailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DumpTrailerController],
      providers: [DumpTrailerService],
    }).compile();

    controller = module.get<DumpTrailerController>(DumpTrailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
