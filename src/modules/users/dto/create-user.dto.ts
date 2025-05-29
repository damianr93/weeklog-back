import { ApiProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator"

export class CreateUserDto {

    @ApiProperty({
        example: 1,
        description: 'ID of the user',
        required: false,
    })
    @IsOptional()
    id?: number

    @ApiProperty({
        example: 'Angel Damian',
        description: 'username of the user',
        maxLength: 15,
        minLength: 4,
    })
    @IsString({ message: 'The username of the user must be string' })
    @IsNotEmpty({ message: 'The username of the user is required' })
    @MaxLength(15, { message: 'username must be less than 15 characters' })
    @MinLength(4, { message: 'username must be mora than 4 characters' })
    username: string

    @ApiProperty({
        example: 1,
        description: 'ID de la planta del operador logístico',
    })
    @IsOptional()
    @IsNotEmpty()
    plantId?: number

    @ApiProperty({
        example: 'admin',
        description: 'role of the user',
    })
    @IsString({ message: 'The role of the user must be string' })
    @IsNotEmpty({ message: 'The role of the user is requires' })
    @IsEnum(['ADMIN', 'OPERATOR', 'DRIVER', 'CLIENT'], { message: 'role must be one of the following values: ADMIN, OPERATOR, DRIVER, CLIENT' })
    role: Role

    @ApiProperty({
        example: 'secret123',
        description: 'User password',
        maxLength: 15,
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MaxLength(15, { message: 'Password must be less than 15 characters' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string
}
