import { FastifyInstance } from 'fastify';
import { generateHLS } from './video.hls';
import { sendKafkaMessage } from '../kafka/producer';
import fs from 'fs';
import path from 'path';

const findInputVideo = async (contentId: string) => {
  const folder = `/storage/raw/${contentId}`;
  const files = await fs.promises.readdir(folder);

  const videoFile = files.find(file =>
    ['.mp4', '.mov', '.mkv', '.avi', '.webm'].includes(path.extname(file).toLowerCase())
  );

  if (!videoFile) throw new Error('No video file found in ' + folder);

  return path.join(folder, videoFile);
};

export const processVideo = async (event: any, app: FastifyInstance) => {
  const { contentId } = event;
  const outputDir = `/storage/processed/${contentId}`;
  try {
    const inputPath = await findInputVideo(contentId);
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
