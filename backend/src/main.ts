import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger: true}),
  );

  await app.register(multipart, {
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
  });
  app.enableCors({
    origin: '*',
  });
  app.useLogger(app.get(Logger));

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
