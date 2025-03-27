import { Module } from '@nestjs/common';
import { DataProcesadaService } from './data-procesada.service';
import { DataProcesadaController } from './data-procesada.controller';
import { PrismaModule } from 'src/services/database-sql/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DataProcesadaController],
  providers: [DataProcesadaService],
})
export class DataProcesadaModule {}
