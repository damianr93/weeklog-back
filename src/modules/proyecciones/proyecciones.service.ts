import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyeccioneDto } from './dto/create-proyeccione.dto';
import { UpdateProyeccioneDto } from './dto/update-proyeccione.dto';
import { PrismaService } from 'src/services/database-sql/prisma.service';


@Injectable()
export class ProyeccionesService {

  constructor(
    private prisma: PrismaService
  ) { }

  async create(createProyeccionDto: CreateProyeccioneDto) {
    const { dateStart, dateEnd, plantaId, createdById } = createProyeccionDto;

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
      createProyeccionDto.horaInicio,
      new Date(dateEnd),
      planta.frecuencia
    );

    // 4. Crear los registros de horarios de retiro
    if (horarios.length > 0) {
      await this.prisma.horarioRetiro.createMany({
        data: horarios.map(horario => ({
          proyeccionId: proyeccion.id,
          fecha: horario.fecha,
          hora: horario.hora,
          productoId: createProyeccionDto.productoId,
          disponible: true,
        }))
      });
    }

    // 5. Retornar la proyección creada con el mismo formato que findAll
    return this.prisma.proyeccion.findUnique({
      where: { id: proyeccion.id },
      include: {
        planta: {
          select: { id: true, name: true, frecuencia: true }
        },
        createdBy: {
          select: { id: true, username: true }
        },
        producto: true,
        _count: {
          select: { horarios: true }
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
        producto: true,
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
          orderBy: { fecha: 'asc' }
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
    const proyeccionToEdit = await this.findOne(id);

    if (proyeccionToEdit.estado === 'activa') {
      return new HttpException('La proyeccion no puede ser editada cuando esta activa', HttpStatus.CONFLICT)
    }

    // Actualizar la proyección
    await this.prisma.proyeccion.update({
      where: { id },
      data: updateProyeccionDto
    });

    const planta = await this.prisma.plantas.findUnique({
      where: { id: updateProyeccionDto.plantaId }
    });


    await this.prisma.horarioRetiro.deleteMany({ where: { proyeccionId: id } })

    // 3. Generar los horarios basados en la frecuencia de la planta
    const horarios = this.generarHorarios(
      new Date(updateProyeccionDto.dateStart),
      updateProyeccionDto.horaInicio,
      new Date(updateProyeccionDto.dateEnd),
      planta.frecuencia
    );

    // 4. Crear los registros de horarios de retiro
    if (horarios.length > 0) {
      await this.prisma.horarioRetiro.createMany({
        data: horarios.map(horario => ({
          proyeccionId: updateProyeccionDto.id,
          fecha: horario.fecha,
          hora: horario.hora,
          productoId: updateProyeccionDto.productoId,
          disponible: true,
        }))
      });
    }


    // Retornar la proyección actualizada con el mismo formato que findAll
    return this.prisma.proyeccion.findUnique({
      where: { id },
      include: {
        planta: {
          select: { id: true, name: true, frecuencia: true }
        },
        createdBy: {
          select: { id: true, username: true }
        },
        producto: true,
        _count: {
          select: { horarios: true }
        }
      }
    });
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

  async regenerarHorarios(id: number, updateProyeccioneDto:UpdateProyeccioneDto) {
    try {
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

      // 2. Determinar la fecha desde la cual regenera
      console.log(updateProyeccioneDto)
      const fechaDesde = new Date(updateProyeccioneDto.dateStart);
   
      // 3. Eliminar horarios futuros que no tengan viaje asignado
      await this.prisma.horarioRetiro.deleteMany({
        where: {
          proyeccionId: id,
          fecha: { gte: fechaDesde },
          viajeId: null,
        }
      });

      // 4. Generar nuevos horarios 
      const horarios = this.generarHorarios(
        fechaDesde,
        updateProyeccioneDto.horaInicio,
        new Date(proyeccion.dateEnd),
        proyeccion.planta.frecuencia
      );

      // 5. Crear los nuevos registros de horarios
      if (horarios.length > 0) {
        await this.prisma.horarioRetiro.createMany({
          data: horarios.map(fechaHora => ({
            proyeccionId: id,
            fecha: fechaHora.fecha,
            hora: fechaHora.hora,
            productoId: proyeccion.plantaId,
            disponible: true,
            viajeId:null
          }))
        });
      }

      return {
        message: `Se han regenerado los horarios correctamente`,
        count: horarios.length
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async findHorariosProyeccion() {
    const fechaActual = new Date();

    const proyecciones = await this.prisma.proyeccion.findMany(
      {
        where: {
          dateEnd: { gte: fechaActual }
        },
        include: {
          horarios: {
            orderBy: [
              { id: 'asc' },
            ]
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
  // Método generarHorarios modificado
  private generarHorarios(
    desde: Date,
    horaInicio: String,
    hasta: Date,
    frecuenciaHoras: number
  ): Array<{ fecha: Date, hora: Date }> {
    const horarios: Array<{ fecha: Date, hora: Date }> = [];

    const [hours, minutes] = horaInicio.split(":").map(Number);

    const horaInicioFormat = new Date();
    horaInicioFormat.setHours(hours);
    horaInicioFormat.setMinutes(minutes);
    horaInicioFormat.setSeconds(0);
    horaInicioFormat.setMilliseconds(0);

    // Obtener las horas y minutos de la hora de inicio
    const horasInicio = horaInicioFormat.getHours();
    const minutosInicio = horaInicioFormat.getMinutes();

    // Establecer la fecha inicial con la hora de inicio proporcionada
    let fechaActual = new Date(desde);
    fechaActual.setHours(horasInicio, minutosInicio, 0, 0);

    while (fechaActual <= hasta) {
      // Crear objeto para la fecha (sin tiempo)
      const fecha = new Date(fechaActual);
      fecha.setHours(0, 0, 0, 0);

      // Crear objeto para la hora (conservando solo hora y minutos)
      const hora = new Date();
      hora.setHours(fechaActual.getHours(), fechaActual.getMinutes(), 0, 0);

      horarios.push({ fecha, hora });

      // Calcula la siguiente fecha sumando la frecuencia
      fechaActual = new Date(fechaActual.getTime() + frecuenciaHoras * 60 * 60 * 1000);
    }

    return horarios;
  }
}