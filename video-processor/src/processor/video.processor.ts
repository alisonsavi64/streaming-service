import { compressVideo } from './video.compress'
import { FastifyInstance } from 'fastify'
import { kafka } from '../kafka/client'

const producer = kafka.producer()
let producerConnected = false

const connectWithRetry = async () => {
  let connected = false;
  while (!connected) {
    try {
      await producer.connect();
      connected = true;
    } catch (err) {
      console.log('Kafka não disponível, tentando novamente...');
      await new Promise(res => setTimeout(res, 3000)); // espera 3s
    }
  }
};

export const processVideo = async (
  event: any,
  app: FastifyInstance
) => {
  const { contentId, videoPath } = event
  app.log.info({ contentId }, 'Starting video compression')
  const outputPath = videoPath.replace('/uploads', '/processed')
  try {
    await compressVideo(videoPath)
    await connectWithRetry()
    const processedEvent = {
      event: 'CONTENT_PROCESSED',
      contentId,
      processedPath: outputPath,
      status: 'READY',
      timestamp: new Date().toISOString(),
    }
    await producer.send({
      topic: 'content.processed',
      messages: [
        {
          key: contentId,
          value: JSON.stringify(processedEvent),
        },
      ],
    })
    app.log.info({ contentId }, 'Video processed successfully')
  } catch (err: any) {
    app.log.error(err, 'Video processing failed')
    await connectWithRetry()
    await producer.send({
      topic: 'content.processed',
      messages: [
        {
          key: contentId,
          value: JSON.stringify({
            event: 'CONTENT_PROCESSING_FAILED',
            contentId,
            error: err.message,
          }),
        },
      ],
    })
  }
}
