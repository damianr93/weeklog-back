import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductoDto {
    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Cemento Portland'
      })
      @IsString()
      @IsNotEmpty()
      readonly name: string;
    
      @ApiProperty({
        description: 'Categoría del producto',
        example: 'Construcción'
      })
      @IsString()
      @IsNotEmpty()
      readonly categoria: string;
    
      @ApiProperty({
        description: 'Presentación del producto',
        example: 'Bolsa 50kg'
      })
      @IsString()
      @IsNotEmpty()
      readonly presentacion: string;
}
