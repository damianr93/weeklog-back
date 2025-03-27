import { PartialType } from '@nestjs/mapped-types';
import { CreateDataProcesadaDto } from './create-data-procesada.dto';

export class UpdateDataProcesadaDto extends PartialType(CreateDataProcesadaDto) {}
