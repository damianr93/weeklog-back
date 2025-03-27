import { PartialType } from '@nestjs/mapped-types';
import { CreateChoferDto } from './create-chofere.dto';


export class UpdateChofereDto extends PartialType(CreateChoferDto) {}
