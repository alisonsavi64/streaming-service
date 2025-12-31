import { generateHLS } from './video.hls';
import { FastifyInstance } from 'fastify';
import { kafka } from '../kafka/client';

const producer = kafka.producer();

export const processVideo = async (
  event: any,
  app: FastifyInstance
) => {
  const { contentId } = event;

  const inputPath = `/storage/raw/${contentId}/source.mp4`;
  const outputDir = `/storage/processed/${contentId}`;

  try {
    await generateHLS(inputPath, outputDir);

    await producer.connect();
    await producer.send({
      topic: 'content.processed',
      messages: [
        {
          key: contentId,
          value: JSON.stringify({
            event: 'CONTENT_READY',
            contentId,
          }),
        },
      ],
    });

    app.log.info({ contentId }, 'Video ready');
  } catch (err: any) {
    app.log.error(err);

    await producer.connect();
    await producer.send({
      topic: 'content.failed',
      messages: [
        {
          key: contentId,
          value: JSON.stringify({
            event: 'CONTENT_FAILED',
            contentId,
            error: err.message,
          }),
        },
      ],
    });
  }
};
