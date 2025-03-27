import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './services/logger/logger';
import { ConfigService } from '@nestjs/config';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(app.get(MyLogger));
  app.use(compression());
  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sistema logistico weeklog')
    .setDescription('Sistema de gestion logistica que permite la administracion de la proyeccion de entregas semanal, con la asignacion de choferes, horarios de carga y descarga, y otras funcionalidades')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(envs.PORT);
}
bootstrap();

