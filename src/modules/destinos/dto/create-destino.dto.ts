import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDestinoDto {
  @ApiProperty({
    description: 'Id del usuario que crea el destino',
    example: 1
  })
  @IsInt()  
  readonly createdByUserId: number;  

  @ApiProperty({
    description: 'Nombre del destino a crear',
    example: 'Estancia Don Juano'
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Descripcion del ingreso al destino, si esta pavimentado, si hay calle de tierra, etc.',
    required: false
  })
  @IsOptional()
  @IsString()  
  readonly condicionesEntrada?: string;

  @ApiProperty({
    description: 'Latitud del destino',
    example: '-34.123456'
  })
  @IsString()  
  readonly lat: string;

  @ApiProperty({
    description: 'Longitud del destino',
    example: '-58.123456'
  })
  @IsString()  
  readonly lng: string;

  @ApiProperty({
    description: 'Distancia existente (en km) entre la planta de carga y el destino donde se entregará la mercaderia',
    example: 1200,
    required: false
  })
  @IsOptional()
  @IsInt()
  readonly distancia_planta?: number; 

  @ApiProperty({
    description: 'Frecuencia con la que el cliente necesita la carga',
    example: 3,
    required: false
  })
  @IsOptional()
  @IsNumber()
  readonly frecuenciaConsumo?: number;

  @ApiProperty({
    description: 'Estimación de próximo consumo',
    example: '2024-03-26T10:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly estimaProximoConsumo?: Date;
}
