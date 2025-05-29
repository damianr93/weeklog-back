import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/services/database-sql/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createClientDto: CreateClientDto) {
    try {
      return await this.prisma.client.create({
        data: createClientDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating client');
    }
  }

  async findAll() {
    try {
      return await this.prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching clients');
    }
  }

  async findOne(id: number) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      return client;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching client');
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const exists = await this.prisma.client.findUnique({ where: { id } });

      if (!exists) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      return await this.prisma.client.update({
        where: { id },
        data: updateClientDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating client');
    }
  }

  async remove(id: number) {
    try {
      const exists = await this.prisma.client.findUnique({ where: { id } });

      if (!exists) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      return await this.prisma.client.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting client');
    }
  }
}
