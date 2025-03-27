import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Post()
  create(@Body() createDestinoDto: CreateDestinoDto) {
    return this.destinosService.create(createDestinoDto);
  }

  @Get()
  findAll() {
    return this.destinosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.destinosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDestinoDto: UpdateDestinoDto) {
    return this.destinosService.update(id, updateDestinoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.destinosService.remove(id);
  }
}
