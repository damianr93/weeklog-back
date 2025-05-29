import { Test, TestingModule } from '@nestjs/testing';
import { DumpTrailerService } from './dump-trailer.service';

describe('DumpTrailerService', () => {
  let service: DumpTrailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DumpTrailerService],
    }).compile();

    service = module.get<DumpTrailerService>(DumpTrailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
