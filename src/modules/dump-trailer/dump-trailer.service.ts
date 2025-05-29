import { Injectable } from '@nestjs/common';
import { CreateDumpTrailerDto } from './dto/create-dump-trailer.dto';
import { UpdateDumpTrailerDto } from './dto/update-dump-trailer.dto';

@Injectable()
export class DumpTrailerService {
  create(createDumpTrailerDto: CreateDumpTrailerDto) {
    return 'This action adds a new dumpTrailer';
  }

  findAll() {
    return `This action returns all dumpTrailer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dumpTrailer`;
  }

  update(id: number, updateDumpTrailerDto: UpdateDumpTrailerDto) {
    return `This action updates a #${id} dumpTrailer`;
  }

  remove(id: number) {
    return `This action removes a #${id} dumpTrailer`;
  }
}
