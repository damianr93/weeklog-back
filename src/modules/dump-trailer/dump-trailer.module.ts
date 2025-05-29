import { Module } from '@nestjs/common';
import { DumpTrailerService } from './dump-trailer.service';
import { DumpTrailerController } from './dump-trailer.controller';

@Module({
  controllers: [DumpTrailerController],
  providers: [DumpTrailerService],
})
export class DumpTrailerModule {}
