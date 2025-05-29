import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectionsService } from './projections.service';
import { CreateProjectionDto } from './dto/create-projection.dto';
import { UpdateProjectionDto } from './dto/update-projection.dto';

@Controller('projections')
export class ProjectionsController {
  constructor(private readonly projectionsService: ProjectionsService) {}

  @Post()
  create(@Body() createProjectionDto: CreateProjectionDto) {
    return this.projectionsService.create(createProjectionDto);
  }

  @Get()
  findAll() {
    return this.projectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectionDto: UpdateProjectionDto) {
    return this.projectionsService.update(+id, updateProjectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectionsService.remove(+id);
  }
}
