import Fastify from 'fastify'
import { startKafkaConsumer } from './kafka/consumer'
import { isGpuEncodingAvailable } from './processor/gpu'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    const gpuAvailable = await isGpuEncodingAvailable()
    app.log.info({ gpuAvailable }, gpuAvailable
      ? 'NVIDIA GPU detected, using NVENC hardware encoding'
      : 'No NVIDIA GPU detected, using CPU encoding')

    await startKafkaConsumer(app)
    const port = process.env.PORT ? parseInt(process.env.PORT) : 4001
    await app.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
