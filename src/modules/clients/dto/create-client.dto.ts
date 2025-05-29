import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'Campo Verde',
    description: 'Name of the client',
    maxLength: 100,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  name: string;

  @ApiProperty({
    example: -34.6037,
    description: 'Latitude of the client location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude({ message: 'Latitude must be a valid coordinate' })
  lat?: number;

  @ApiProperty({
    example: -58.3816,
    description: 'Longitude of the client location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude({ message: 'Longitude must be a valid coordinate' })
  lng?: number;

  @ApiProperty({
    example: 120,
    description: 'Distance in kilometers from plant to client',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Distance must be a number' })
  distance?: number;
}


