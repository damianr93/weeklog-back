import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from "class-transformer";

export class CreateChoferDto {
  @ApiProperty({
    description: 'ID del usuario que crea el chofer',
    example: 1
  })
  @IsInt()
  readonly createdByUserId: number; 

  @ApiProperty({
    description: 'Nombre del chofer',
    example: 'Juan'
  })
  @IsString()
  readonly name: string; 

  @ApiProperty({
    description: 'Apellido del chofer',
    example: 'Pérez'
  })
  @IsString()
  readonly lastName: string; 

  @ApiProperty({
    description: 'Número de celular del chofer',
    example: '38040303456'
  })
  @IsString()
  readonly celular: string; 

  @ApiPropertyOptional({
    description: 'ID de la planta habitual del chofer',
    example: 1
  })
  @IsOptional()
  @IsInt()
  readonly plantaHabitualId?: number;

  @ApiPropertyOptional({
    description: 'Fecha de creación',
    example: '2024-03-26T12:00:00Z'
  })
  @IsOptional()
  @Type(() => Date)
  readonly createdAt?: Date = new Date();
}