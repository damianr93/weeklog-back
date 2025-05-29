import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    IsNumber,
} from 'class-validator';

export class CreateDriverDto {
    @ApiProperty({
        example: 'Juan',
        description: 'Driver first name',
        maxLength: 50,
    })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    @MaxLength(50, { message: 'First name must be less than 50 characters' })
    firstName: string;

    @ApiProperty({
        example: 'Pérez',
        description: 'Driver last name',
        maxLength: 50,
    })
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    @MaxLength(50, { message: 'Last name must be less than 50 characters' })
    lastName: string;

    @ApiProperty({
        example: '+54 9 11 1234 5678',
        description: 'Phone number of the driver',
    })
    @IsString({ message: 'Phone must be a string' })
    @IsNotEmpty({ message: 'Phone is required' })
    phone: string;

    @ApiProperty({
        example: 1,
        description: 'ID of the associated plant',
        required: false,
    })
    @IsOptional()
    @IsNumber({}, { message: 'Plant ID must be a number' })
    plantId?: number;

    @ApiProperty({
        example: 3,
        description: 'ID of the assigned truck',
        required: false,
    })
    @IsOptional()
    @IsNumber({}, { message: 'Truck ID must be a number' })
    truckId?: number;
}
