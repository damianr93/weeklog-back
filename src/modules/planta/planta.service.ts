import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class PlantaService {

  constructor(
    private prisma: PrismaService
  ) { };

  async create(createPlantaDto: CreatePlantaDto) {
    try {

      const existingPlanta = await this.prisma.plantas.findFirst({
        where: {
          name: createPlantaDto.name,
        }
      });

      if (existingPlanta) {
        throw new ConflictException('Ya existe una planta con este nombre');
      };

      const createdPlanta = await this.prisma.plantas.create({
        data: {
          ...createPlantaDto
        }
      });

      return createdPlanta;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    };
  };

  async findAll() {
    try {
      const allPlantas = await this.prisma.plantas.findMany();

      if (allPlantas.length === 0) {
        return { message: 'No hay datos' }
      };

      return allPlantas;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    };
  };

  async findOne(id: number) {
    try {
      const foundPlanta = await this.prisma.plantas.findUnique({
        where: { id }
      });

      if (!foundPlanta) {
        return { message: 'No existe la planta' };
      };

      return foundPlanta;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    };
  };
  async update(id: number, updatePlantaDto: UpdatePlantaDto) {
    try {
      const updatedPlanta = await this.prisma.plantas.update({
        where: { id },
        data: updatePlantaDto
      });

      return updatedPlanta;

    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Planta no encontrada', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      
      const removedPlanta = await this.prisma.plantas.delete({where:{id}})
      
      return removedPlanta;
      
    } catch (error) {
      if(error.code === 'P2025') {
        throw new HttpException('Planta no encontrada', HttpStatus.NOT_FOUND);
      };

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)      
    };
  }
}
