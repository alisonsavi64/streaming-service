import { FastifyInstance } from 'fastify'
import { kafka } from '../kafka/client'

const producer = kafka.producer()
export const processVideo = async (
  event: any,
  app: FastifyInstance
) => {
  const { contentId, videoPath } = event
  app.log.info(`Processing video ${contentId}`)
  await new Promise((res) => setTimeout(res, 5000))
  const processedEvent = {
    event: 'CONTENT_PROCESSED',
    contentId,
    processedPath: videoPath.replace('/uploads', '/processed'),
    status: 'READY',
    timestamp: new Date().toISOString(),
  }
  await producer.connect()
  await producer.send({
    topic: 'content.processed',
    messages: [
      {
        key: contentId,
        value: JSON.stringify(processedEvent),
      },
    ],
  })
  app.log.info(`Video processed: ${contentId}`)
}
