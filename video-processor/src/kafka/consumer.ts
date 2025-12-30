import { kafka } from './client'
import { processVideo } from '../processor/video.processor'
import { FastifyInstance } from 'fastify'

export const startKafkaConsumer = async (app: FastifyInstance) => {
  const consumer = kafka.consumer({ groupId: 'video-processor-group' })
  await consumer.connect()
  await consumer.subscribe({
    topic: 'content.uploaded',
    fromBeginning: false,
  })
  app.log.info('Kafka consumer connected')
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return
      const event = JSON.parse(message.value.toString())
      app.log.info({ event }, 'Processing video')
      await processVideo(event, app)
    },
  })
}
