// src/dtos/planta-productos.dto.ts

import { IsInt, IsArray, IsPositive, IsOptional, ArrayMinSize } from 'class-validator';

// DTO para asignar un solo producto a una planta
export class AsignarProductoPlantaDto {
  @IsInt()
  @IsPositive()
  plantaId: number;

  @IsInt()
  @IsPositive()
  productoId: number;
}

// DTO para asignar múltiples productos a una planta
export class AsignarMultiplesProductosPlantaDto {
  @IsInt()
  @IsPositive()
  plantaId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  productoIds: number[];
}

// DTO para buscar productos por planta
export class BuscarProductosPorPlantaDto {
  @IsInt()
  @IsPositive()
  plantaId: number;
}

// DTO para buscar plantas por producto
export class BuscarPlantasPorProductoDto {
  @IsInt()
  @IsPositive()
  productoId: number;
}

// DTO para actualizar los productos de una planta
export class ActualizarProductosPlantaDto {
  @IsInt()
  @IsPositive()
  plantaId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  productoIds: number[];
}

// DTO para la respuesta de la consulta a PlantaProductos
export class PlantaProductoResponseDto {
  id: number;
  plantaId: number;
  productoId: number;
  
  @IsOptional()
  planta?: {
    id: number;
    name: string;
    lat: number;
    lng: number;
  };
  
  @IsOptional()
  producto?: {
    id: number;
    name: string;
    categoria: string;
    presentacion: string;
  };
}

// DTO para respuestas simples
export class OperacionExitosaDto {
  success: boolean;
  message?: string;
}