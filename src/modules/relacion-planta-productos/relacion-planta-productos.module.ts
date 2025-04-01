import { Module } from '@nestjs/common';
import { RelacionPlantaProductosService } from './relacion-planta-productos.service';
import { RelacionPlantaProductosController } from './relacion-planta-productos.controller';
import { PrismaModule } from 'src/services/database-sql/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RelacionPlantaProductosController],
  providers: [RelacionPlantaProductosService],
})
export class RelacionPlantaProductosModule {}
