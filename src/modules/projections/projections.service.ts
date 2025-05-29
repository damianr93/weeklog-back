import { Injectable } from '@nestjs/common';
import { CreateProjectionDto } from './dto/create-projection.dto';
import { UpdateProjectionDto } from './dto/update-projection.dto';

@Injectable()
export class ProjectionsService {
  create(createProjectionDto: CreateProjectionDto) {
    return 'This action adds a new projection';
  }

  findAll() {
    return `This action returns all projections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projection`;
  }

  update(id: number, updateProjectionDto: UpdateProjectionDto) {
    return `This action updates a #${id} projection`;
  }

  remove(id: number) {
    return `This action removes a #${id} projection`;
  }
}
