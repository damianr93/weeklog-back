import { Proyeccion, HorarioRetiro, Plantas, User } from '@prisma/client';

/**
 * Interfaz para el servicio de proyecciones
 */
export interface IProyeccionesService {
  create(createProyeccionDto: CreateProyeccionDto): Promise<ProyeccionWithRelations>;
  findAll(): Promise<ProyeccionWithRelations[]>;
  findOne(id: number): Promise<ProyeccionWithRelations>;
  update(id: number, updateProyeccionDto: UpdateProyeccionDto): Promise<ProyeccionWithRelations>;
  remove(id: number): Promise<Proyeccion>;
  activarProyeccion(id: number): Promise<Proyeccion>;
  finalizarProyeccion(id: number): Promise<Proyeccion>;
  regenerarHorarios(id: number, desde?: Date): Promise<{ message: string; count: number }>;
}

/**
 * DTO para crear una nueva proyección
 */
export interface CreateProyeccionDto {
  nombre: string;
  dateStart: string | Date;
  dateEnd: string | Date;
  plantaId: number;
  createdById: number;
  estado?: string;
}

/**
 * DTO para actualizar una proyección existente
 */
export interface UpdateProyeccionDto {
  nombre?: string;
  dateStart?: string | Date;
  dateEnd?: string | Date;
  estado?: string;
}

/**
 * DTO para regenerar horarios
 */
export interface RegenerarHorariosDto {
  desde?: string | Date; 
  nuevaFrecuencia?: number; 
}

/**
 * Interfaz para proyección con sus relaciones
 */
export interface ProyeccionWithRelations extends Proyeccion {
  horarios?: HorarioRetiro[];
  planta?: Plantas;
  createdBy?: User;
}

/**
 * Interfaz para horario de retiro con sus relaciones
 */
export interface HorarioRetiroWithRelations extends HorarioRetiro {
  proyeccion?: Proyeccion;
  viaje?: any; 
}

/**
 * Respuesta para consultas de proyección
 */
export interface ProyeccionResponse {
  id: number;
  nombre: string;
  dateStart: Date;
  dateEnd: Date;
  estado: string;
  planta: {
    id: number;
    name: string;
    frecuencia: number;
  };
  createdBy: {
    id: number;
    username: string;
  };
  horarios: Array<{
    id: number;
    fechaHora: Date;
    disponible: boolean;
    viajeId: number | null;
    productoId: number | null;
  }>;
  totalHorarios: number;
  horariosDisponibles: number;
}