import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/database-sql/prisma.service';

@Injectable()
export class RelacionPlantaProductosService {

  constructor(
    private prisma: PrismaService,
  ){}

/**
   * Asigna un producto a una planta
   */
async asignarProductoAPlanta(plantaId: number, productoId: number) {
  try {
    const plantaProducto = await this.prisma.plantaProductos.create({
      data: {
        plantaId,
        productoId,
      },
      include: {
        planta: true,
        producto: true,
      },
    });
    return plantaProducto;
  } catch (error) {
    // Manejo de errores, por ejemplo si la relación ya existe
    console.error('Error al asignar producto a planta:', error);
    throw error;
  }
}

/**
 * Obtiene todos los productos asociados a una planta específica
 */
async getProductosByPlantaId(plantaId: number) {
  try {
    const productos = await this.prisma.plantaProductos.findMany({
      where: {
        plantaId,
      },
      include: {
        producto: true,
      },
    });
    
    // Devuelve solo la información del producto, no la relación completa
    return productos.map(item => item.producto);
  } catch (error) {
    console.error('Error al obtener productos de la planta:', error);
    throw error;
  }
}

/**
 * Obtiene todas las plantas donde está disponible un producto específico
 */
async getPlantasByProductoId(productoId: number) {
  try {
    const plantas = await this.prisma.plantaProductos.findMany({
      where: {
        productoId,
      },
      include: {
        planta: true,
      },
    });
    
    // Devuelve solo la información de la planta, no la relación completa
    return plantas.map(item => item.planta);
  } catch (error) {
    console.error('Error al obtener plantas del producto:', error);
    throw error;
  }
}

/**
 * Verifica si un producto está disponible en una planta específica
 */
async existeRelacion(plantaId: number, productoId: number) {
  try {
    const relacion = await this.prisma.plantaProductos.findFirst({
      where: {
        plantaId,
        productoId,
      },
    });
    
    return !!relacion; // Retorna true si existe, false si no
  } catch (error) {
    console.error('Error al verificar relación planta-producto:', error);
    throw error;
  }
}

/**
 * Elimina un producto de una planta
 */
async eliminarProductoDePlanta(plantaId: number, productoId: number) {
  try {
    await this.prisma.plantaProductos.delete({
      where: {
        // Usar la restricción única
        plantaId_productoId: {
          plantaId,
          productoId,
        },
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar producto de planta:', error);
    throw error;
  }
}

/**
 * Asigna múltiples productos a una planta
 */
async asignarProductosAPlanta(plantaId: number, productoIds: number[]) {
  const transaccion = await this.prisma.$transaction(
    productoIds.map(productoId => 
      this.prisma.plantaProductos.upsert({
        where: {
          plantaId_productoId: {
            plantaId,
            productoId,
          },
        },
        update: {}, // No hay nada que actualizar si ya existe
        create: {
          plantaId,
          productoId,
        },
      })
    )
  );
  
  return transaccion;
}

/**
 * Actualiza los productos de una planta (elimina los existentes y agrega los nuevos)
 */
async actualizarProductosDePlanta(plantaId: number, productoIds: number[]) {
  try {
    // Eliminar todos los productos actuales de la planta
    await this.prisma.plantaProductos.deleteMany({
      where: {
        plantaId,
      },
    });
    
    // Crear nuevas relaciones
    if (productoIds.length > 0) {
      await this.asignarProductosAPlanta(plantaId, productoIds);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar productos de planta:', error);
    throw error;
  }
}
}
