import Fastify from 'fastify'
import { startKafkaConsumer } from './kafka/consumer'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    await startKafkaConsumer(app)
    await app.listen({ port: 4001, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
