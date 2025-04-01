import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateViajeDto {
  @ApiProperty({ description: 'El ID del usuario que creó el viaje', example: 3 })
  @IsInt()
  readonly createdByUserId: number;

  @ApiProperty({ description: 'El ID de la planta de origen del viaje', example: 1 })
  @IsInt()
  readonly plantaId: number;

  @ApiProperty({ description: 'El ID del destino al que se dirige el viaje', example: 2 })
  @IsInt()
  readonly destinoId: number;

  @ApiProperty({ description: 'El ID del chofer asignado al viaje', example: 2 })
  @IsInt()
  readonly choferId: number;

  @ApiProperty({ description: 'La fecha de carga del viaje', example: '2021-10-01' })
  @IsDateString()
  readonly fechaCarga: string;

  @ApiProperty({ description: 'La hora de carga del viaje', example: '08:00' })
  @IsString()
  readonly horaCarga: string;

  @ApiProperty({ description: 'Kilómetros recorridos en el viaje', example: 123, required: false })
  @IsOptional()
  @IsNumber()
  readonly kmRealesRecorridos?: number;

  @ApiProperty({ description: 'Tiempo estimado de carga', example: 2, required: false })
  @IsOptional()
  @IsNumber()
  readonly tiempoEstimadoCarga?: number;

  @ApiProperty({ description: 'Hora de descarga del viaje', example: '12:00', required: false })
  @IsOptional()
  @IsString()
  readonly horaDescarga?: string;

  @ApiProperty({ description: 'Hora de retorno del viaje', example: '16:00', required: false })
  @IsOptional()
  @IsString()
  readonly horaRetorno?: string;

  @ApiProperty({
    description: 'Observaciones del viaje',
    example: 'El cliente pidió que la próxima vez se avise antes de llegar',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly observaciones?: string;

  @IsNumber()
  @IsOptional()
  horarioRetiroId:number
}