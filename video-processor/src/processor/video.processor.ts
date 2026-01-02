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

export const processVideo = async (event: any, app: FastifyInstance, heartbeat?: () => Promise<void>) => {
  const { contentId } = event
  const outputDir = `/storage/processed/${contentId}`
  const doneFile = path.join(outputDir, '.done')

  try {
    if (fs.existsSync(doneFile)) {
      app.log.info({ contentId }, 'Video already processed, sending ready event')
      await sendKafkaMessage('content.processed', contentId, { event: 'CONTENT_READY', contentId })
      return
    }

    await sendKafkaMessage('content.processing', contentId, { event: 'CONTENT_PROCESSING', contentId })
    app.log.info({ contentId }, 'Video processing started')

    if (fs.existsSync(outputDir)) {
      await fs.promises.rm(outputDir, { recursive: true, force: true })
    }

    const inputPath = await findInputVideo(contentId)

    const ffmpegPromise = generateHLS(inputPath, outputDir)
    if (heartbeat) {
      const interval = setInterval(() => heartbeat(), 5000)
      await ffmpegPromise
      clearInterval(interval)
    } else {
      await ffmpegPromise
    }
    await fs.promises.writeFile(doneFile, 'ok')
    await sendKafkaMessage('content.processed', contentId, { event: 'CONTENT_READY', contentId })
    app.log.info({ contentId }, 'Video ready')

  } catch (err: any) {
    app.log.error(err)
    await sendKafkaMessage('content.failed', contentId, { event: 'CONTENT_FAILED', contentId, error: err.message })
  }
}
