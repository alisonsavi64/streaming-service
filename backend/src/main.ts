import { NestFactory } from '@nestjs/core';
import './tracing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

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
    }),
  );

  await app.register(multipart, {
    limits: { fileSize: 100 * 1024 * 1024 },
  });
  app.enableCors({ origin: '*' });

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
