import { Module } from '@nestjs/common';
import { PlantaService } from './planta.service';
import { PlantaController } from './planta.controller';
import { PrismaModule } from 'src/services/database-sql/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlantaController],
  providers: [PlantaService],
})
export class PlantaModule {}
