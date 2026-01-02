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
  autoCommit: false, 
  eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, isRunning, isStale }) => {
    for (const message of batch.messages) {
      if (!isRunning() || isStale()) break
      if (!message.value) continue
      const event = JSON.parse(message.value.toString())
      try {
        await processVideo(event, app, heartbeat)
        resolveOffset(message.offset)
        await commitOffsetsIfNecessary()
      } catch (err) {
        app.log.error(err)
        break 
      }
    }
  }
})

}
