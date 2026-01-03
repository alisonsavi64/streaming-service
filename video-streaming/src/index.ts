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
      manifestUrl: `${process.env.STORAGE_HOST}/videos/${id}/master.m3u8`,
      type: 'HLS',
    };
  });
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3003
  await app.listen({ port, host: '0.0.0.0' });
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
