import { NestFactory } from '@nestjs/core';
import './tracing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const isDev = process.env.NODE_ENV !== 'production';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: isDev
        ? {
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss' },
          },
        }
        : {
          level: 'info',
        },
      bodyLimit: 104857600,
    }),
  );
  await app.register(multipart, {
    limits: { fileSize: 100 * 1024 * 1024 },
  });
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('WatchTube API')
    .setDescription('API para gerenciamento de vídeos, usuários e conteúdos, permitindo upload, atualização, listagem e controle de acesso dos conteúdos.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
  if (isDev) {
    console.log(`Swagger available at ${process.env.API_BASE_URL}/api`);
  }
}

bootstrap();
