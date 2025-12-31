import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';

const app = Fastify({ logger: true });

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
    manifestUrl: `http://nginx/videos/${id}/master.m3u8`,
    type: 'HLS',
  };

});

app.listen({ port: 4000, host: '0.0.0.0' });
