import { generateHLS } from './video.hls';
import { FastifyInstance } from 'fastify';
import { sendKafkaMessage } from '../kafka/producer';

export const processVideo = async (
  event: any,
  app: FastifyInstance
) => {
  const { contentId } = event;

  const inputPath = `/storage/raw/${contentId}/source.mp4`;
  const outputDir = `/storage/processed/${contentId}`;

  try {
    await generateHLS(inputPath, outputDir);

    await sendKafkaMessage(
      'content.processed',
      contentId,
      {
        event: 'CONTENT_READY',
        contentId,
      }
    );

    app.log.info({ contentId }, 'Video ready');
  } catch (err: any) {
    app.log.error(err);

    await sendKafkaMessage(
      'content.failed',
      contentId,
      {
        event: 'CONTENT_FAILED',
        contentId,
        error: err.message,
      }
    );
  }
};
