import { PartialType } from '@nestjs/mapped-types';
import { CreateDumpTrailerDto } from './create-dump-trailer.dto';

export class UpdateDumpTrailerDto extends PartialType(CreateDumpTrailerDto) {}
