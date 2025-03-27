
import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNumber, IsOptional, IsNotEmpty } from "class-validator"

export class CreatePlantaDto {
    @ApiProperty({
        example: 'Planta San Pedro',
        description: 'Nombre de la planta',
    })
    @IsString({ message: 'El nombre de la planta debe ser una cadena' })
    @IsNotEmpty({ message: 'El nombre de la planta es obligatorio' })
    name: string

    @ApiProperty({
        example: -34.6037,
        description: 'Latitud de la planta',
    })
    @IsNumber({}, { message: 'La latitud debe ser un número' })
    @IsNotEmpty({ message: 'La latitud es obligatoria' })
    lat: number

    @ApiProperty({
        example: -58.3816,
        description: 'Longitud de la planta',
    })
    @IsNumber({}, { message: 'La longitud debe ser un número' })
    @IsNotEmpty({ message: 'La longitud es obligatoria' })
    lng: number

    @ApiProperty({
        example: 2.5,
        description: 'Frecuencia de la planta',
        required: false
    })
    @IsNumber({}, { message: 'La frecuencia debe ser un número' })
    @IsOptional()
    frecuencia?: number | null

    @ApiProperty({
        example: 'Lunes a Viernes 08:00-17:00',
        description: 'Horarios de retiros',
        required: false
    })
    @IsString({ message: 'Los horarios de retiros deben ser una cadena' })
    @IsOptional()
    horariosRetiros?: string | null
}

