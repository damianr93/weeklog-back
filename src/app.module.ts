import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyLogger } from './services/logger/logger';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ChoferesModule } from './modules/choferes/choferes.module';
import { DestinosModule } from './modules/destinos/destinos.module';
import { ViajesModule } from './modules/viajes/viajes.module';
import { DataProcesadaModule } from './modules/data-procesada/data-procesada.module';
import { PlantaModule } from './modules/planta/planta.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ProyeccionesModule } from './modules/proyecciones/proyecciones.module';
import { RelacionPlantaProductosModule } from './modules/relacion-planta-productos/relacion-planta-productos.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { PrismaService } from './services/database-sql/prisma.service';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ChoferesModule,
    DestinosModule,
    ViajesModule,
    DataProcesadaModule,
    PlantaModule,
    ProductosModule,
    ProyeccionesModule,
    RelacionPlantaProductosModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    MyLogger,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

