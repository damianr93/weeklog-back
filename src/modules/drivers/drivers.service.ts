import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/database-sql/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDriverDto: CreateDriverDto) {
    try {
      const { truckId, plantId } = createDriverDto;

      if (truckId) {
        const truck = await this.prisma.truck.findUnique({ where: { id: truckId } });
        if (!truck) {
          throw new NotFoundException('Truck not found');
        }
      }

      if (plantId) {
        const plant = await this.prisma.plant.findUnique({ where: { id: plantId } });
        if (!plant) {
          throw new NotFoundException('Plant not found');
        }
      }

      return await this.prisma.driver.create({
        data: createDriverDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error creating driver');
    }
  }

  async findAll() {
    try {
      return await this.prisma.driver.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching drivers');
    }
  }

  async findOne(id: number) {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id },
      });

      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }

      return driver;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching driver');
    }
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    try {
      const { truckId, plantId } = updateDriverDto;
      const exists = await this.prisma.driver.findUnique({ where: { id } });

      if (truckId) {
        const truck = await this.prisma.truck.findUnique({ where: { id: truckId } });
        if (!truck) {
          throw new NotFoundException('Truck not found');
        }
      } 
      if (plantId) {
        const plant = await this.prisma.plant.findUnique({ where: { id: plantId } });
        if (!plant) {
          throw new NotFoundException('Plant not found');
        }
      }
      if (!exists) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }

      return await this.prisma.driver.update({
        where: { id },
        data: updateDriverDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating driver');
    }
  }

  async remove(id: number) {
    try {
      const exists = await this.prisma.driver.findUnique({ where: { id } });

      if (!exists) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }

      return await this.prisma.driver.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting driver');
    }
  }
}
