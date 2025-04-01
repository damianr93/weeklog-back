import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyeccioneDto } from './dto/create-proyeccione.dto';
import { UpdateProyeccioneDto } from './dto/update-proyeccione.dto';
import { PrismaService } from 'src/services/database-sql/prisma.service';


@Injectable()
export class ProyeccionesService {

  constructor(
    private prisma: PrismaService
  ) { }

  async create(createProyeccionDto: CreateProyeccioneDto) {
    const { nombre, dateStart, dateEnd, plantaId, createdById } = createProyeccionDto;

    // 1. Buscar la planta para obtener la frecuencia
    const planta = await this.prisma.plantas.findUnique({
      where: { id: plantaId }
    });

    if (!planta || !planta.frecuencia) {
      throw new NotFoundException('La planta no existe o no tiene definida una frecuencia');
    }

    // 2. Crear la proyección en la base de datos
    const proyeccion = await this.prisma.proyeccion.create({
      data: {
        nombre: `Proyeccion creada el ${new Date}`,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        productoId: createProyeccionDto.productoId,
        plantaId,
        createdById,
        estado: createProyeccionDto.estado || 'borrador'
      }
    });

    // 3. Generar los horarios basados en la frecuencia de la planta
    const horarios = this.generarHorarios(
      new Date(dateStart),
      new Date(dateEnd),
      planta.frecuencia
    );
    
    // 4. Crear los registros de horarios de retiro
    if (horarios.length > 0) {
      await this.prisma.horarioRetiro.createMany({
        data: horarios.map(fechaHora => ({
          proyeccionId: proyeccion.id,
          fechaHora,
          productoId: createProyeccionDto.productoId,
          disponible: true,
        }))
      });
    }

    // 5. Retornar la proyección creada con sus horarios
    return this.prisma.proyeccion.findUnique({
      where: { id: proyeccion.id },
      include: {
        horarios: {
          orderBy: { fechaHora: 'asc' }
        },
        planta: {
          select: { id: true, name: true, frecuencia: true }
        },
        createdBy: {
          select: { id: true, username: true }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.proyeccion.findMany({
      include: {
        planta: {
          select: { id: true, name: true, frecuencia: true }
        },
        createdBy: {
          select: { id: true, username: true }
        },
        _count: {
          select: { horarios: true }
        }
      }
    });
  }

  async findOne(id: number) {
    const proyeccion = await this.prisma.proyeccion.findUnique({
      where: { id },
      include: {
        horarios: {
          orderBy: { fechaHora: 'asc' }
        },
        planta: {
          select: { id: true, name: true, frecuencia: true }
        },
        createdBy: {
          select: { id: true, username: true }
        }
      }
    });

    if (!proyeccion) {
      throw new NotFoundException(`No se encontró la proyección con ID ${id}`);
    }

    return proyeccion;
  }

  async update(id: number, updateProyeccionDto: UpdateProyeccioneDto) {
    // Verificar que la proyección existe
    await this.findOne(id);

    // Actualizar la proyección
    await this.prisma.proyeccion.update({
      where: { id },
      data: updateProyeccionDto
    });

    // Retornar la proyección actualizada
    return this.findOne(id);
  }

  async remove(id: number) {
    // Verificar que la proyección existe
    await this.findOne(id);

    // Eliminar la proyección (los horarios se eliminarán en cascada)
    return this.prisma.proyeccion.delete({
      where: { id }
    });
  }

  async activarProyeccion(id: number) {
    // Verificar que la proyección existe
    await this.findOne(id);

    // Actualizar el estado a 'activa'
    return this.prisma.proyeccion.update({
      where: { id },
      data: { estado: 'activa' }
    });
  }

  async finalizarProyeccion(id: number) {
    // Verificar que la proyección existe
    await this.findOne(id);

    // Actualizar el estado a 'finalizada'
    return this.prisma.proyeccion.update({
      where: { id },
      data: { estado: 'finalizada' }
    });
  }

  async regenerarHorarios(id: number, desde?: Date) {
    // 1. Obtener la proyección y la planta
    const proyeccion = await this.prisma.proyeccion.findUnique({
      where: { id },
      include: { planta: true }
    });

    if (!proyeccion) {
      throw new NotFoundException(`No se encontró la proyección con ID ${id}`);
    }

    if (!proyeccion.planta.frecuencia) {
      throw new Error('La planta asociada no tiene definida una frecuencia');
    }

    // 2. Determinar la fecha desde la cual regenerar
    const fechaDesde = desde || new Date();

    // 3. Eliminar horarios futuros que no tengan viaje asignado
    await this.prisma.horarioRetiro.deleteMany({
      where: {
        proyeccionId: id,
        fechaHora: { gte: fechaDesde },
        viajeId: null,
      }
    });

    // 4. Generar nuevos horarios
    const horarios = this.generarHorarios(
      fechaDesde,
      new Date(proyeccion.dateEnd),
      proyeccion.planta.frecuencia
    );

    // 5. Crear los nuevos registros de horarios
    if (horarios.length > 0) {
      await this.prisma.horarioRetiro.createMany({
        data: horarios.map(fechaHora => ({
          proyeccionId: id,
          fechaHora,
          productoId: proyeccion.plantaId,
          disponible: true,
        }))
      });
    }

    return {
      message: `Se han regenerado los horarios correctamente`,
      count: horarios.length
    };
  }

  async findHorariosProyeccion() {
    const fechaActual = new Date();

    const proyecciones = await this.prisma.proyeccion.findMany({
      where: {
        dateEnd: { gte: fechaActual }
      },
      include: {
        horarios: {
          orderBy: { fechaHora: 'asc' }
        }
      }
    });

    if (!proyecciones.length) {
      throw new NotFoundException('No se encontraron proyecciones en vigencia');
    }

    return proyecciones.flatMap(proyeccion => proyeccion.horarios);
  }

  /**
   * Genera una lista de fechas basadas en la frecuencia especificada
   * @param desde Fecha de inicio
   * @param hasta Fecha de fin
   * @param frecuenciaHoras Frecuencia en horas
   * @returns Array de fechas generadas
   */
  private generarHorarios(desde: Date, hasta: Date, frecuenciaHoras: number): Date[] {
    const horarios: Date[] = [];
    let fechaActual = new Date(desde);

    while (fechaActual <= hasta) {
      horarios.push(new Date(fechaActual));
      // Calcula la siguiente fecha sumando la frecuencia en milisegundos
      fechaActual = new Date(fechaActual.getTime() + frecuenciaHoras * 60 * 60 * 1000);
    }

    return horarios;
  }
}