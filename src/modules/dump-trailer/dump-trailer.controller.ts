import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DumpTrailerService } from './dump-trailer.service';
import { CreateDumpTrailerDto } from './dto/create-dump-trailer.dto';
import { UpdateDumpTrailerDto } from './dto/update-dump-trailer.dto';

@Controller('dump-trailer')
export class DumpTrailerController {
  constructor(private readonly dumpTrailerService: DumpTrailerService) {}

  @Post()
  create(@Body() createDumpTrailerDto: CreateDumpTrailerDto) {
    return this.dumpTrailerService.create(createDumpTrailerDto);
  }

  @Get()
  findAll() {
    return this.dumpTrailerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dumpTrailerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDumpTrailerDto: UpdateDumpTrailerDto) {
    return this.dumpTrailerService.update(+id, updateDumpTrailerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dumpTrailerService.remove(+id);
  }
}
