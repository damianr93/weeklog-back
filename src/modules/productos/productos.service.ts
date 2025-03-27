import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'src/services/database-sql/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createProductoDto: CreateProductoDto) {
    try {
      const createdProducto = await this.prisma.productos.create({
        data: {
          ...createProductoDto
        }
      });

      return createdProducto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
          throw new HttpException(
            'Ya existe un producto con estos datos',
            HttpStatus.CONFLICT
          );
        }

        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        error.message || 'Error al crear producto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      const productos = await this.prisma.productos.findMany({
        orderBy: {
          name: 'asc'
        },
        include: {
          plantaProductos: true
        }
      });

      return productos;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        error.message || 'Error al buscar productos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: number) {
    try {
      const productos = await this.prisma.productos.findUnique({
        where: { id },
        include: {
          plantaProductos: true
        }
      });

      return productos;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        error.message || 'Error al buscar producto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {

      const existingProducto = await this.prisma.productos.findUnique({
        where: { id }
      });

      if (!existingProducto) {
        throw new HttpException(
          `Producto con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND
        );
      }

      const updatedProducto = await this.prisma.productos.update({
        where: { id },
        data: { ...updateProductoDto }
      });

      return updatedProducto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Ya existe un producto con estos datos',
            HttpStatus.CONFLICT
          );
        }

        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        error.message || 'Error al actualizar producto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number) {
    try {
      const existingProducto = await this.prisma.productos.findUnique({
        where: { id }
      });

      if (!existingProducto) {
        throw new HttpException(
          `Producto con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND
        );
      }

      const plantaProductosCount = await this.prisma.plantaProductos.count({
        where: { productoId: id }
      });

      if (plantaProductosCount > 0) {
        throw new HttpException(
          `No se puede eliminar el producto. Tiene ${plantaProductosCount} relación(es) con plantas`,
          HttpStatus.CONFLICT
        );
      }

      const deletedProducto = await this.prisma.productos.delete({
        where: { id }
      });

      return deletedProducto;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new HttpException(
            'No se puede eliminar el producto debido a restricciones de integridad',
            HttpStatus.CONFLICT
          );
        }

        throw new HttpException(
          `Error de base de datos: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        error.message || 'Error al eliminar el producto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
