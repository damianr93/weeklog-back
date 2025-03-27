import { Module } from '@nestjs/common';
import { ChoferesService } from './choferes.service';
import { ChoferesController } from './choferes.controller';
import { PrismaModule } from 'src/services/database-sql/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChoferesController],
  providers: [ChoferesService],
})
export class ChoferesModule {}
