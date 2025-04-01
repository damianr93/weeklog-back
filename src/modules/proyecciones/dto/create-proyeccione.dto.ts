import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProyeccioneDto {
    @IsString()
    @IsOptional()
    nombre: string;
  
    @IsDateString()
    dateStart: string;
  
    @IsDateString()
    dateEnd: string;
  
    @IsNumber()
    plantaId: number;
  
    @IsNumber()
    createdById: number;
  
    @IsString()
    @IsOptional()
    estado?: string = 'borrador';

    @IsNumber()
    productoId: number  
}
