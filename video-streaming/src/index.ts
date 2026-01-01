import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs';
import path from 'path';

async function bootstrap() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  app.get('/stream/:id', async (req, reply) => {
    const { id } = req.params as { id: string };

    const manifestPath = path.join(
      '/storage/processed',
      id,
      'master.m3u8'
    );

    if (!fs.existsSync(manifestPath)) {
      return reply.status(404).send({ error: 'Not ready' });
    }

    return {
      contentId: id,
      manifestUrl: `http://localhost:8080/videos/${id}/master.m3u8`,
      type: 'HLS',
    };
  });

  await app.listen({ port: 3003, host: '0.0.0.0' });
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
