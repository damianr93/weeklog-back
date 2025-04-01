import { Module } from '@nestjs/common';
import { ProyeccionesService } from './proyecciones.service';
import { ProyeccionesController } from './proyecciones.controller';
import { PrismaModule } from 'src/services/database-sql/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProyeccionesController],
  providers: [ProyeccionesService],
})
export class ProyeccionesModule {}
