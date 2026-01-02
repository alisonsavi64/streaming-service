import { Injectable, OnModuleInit } from '@nestjs/common'
import { KafkaService } from '../kafka.service'
import { MarkContentProcessedUseCase } from '../../../../../content/application/mark-content-processed.use-case'
import { MarkContentProcessingUseCase } from '../../../../../content/application/mark-content-processing.use-case'
import { MarkContentFailedUseCase } from '../../../../../content/application/mark-content-failed.use-case'

@Injectable()
export class KafkaConsumerRunner implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly markProcessed: MarkContentProcessedUseCase,
    private readonly markProcessing: MarkContentProcessingUseCase,
    private readonly markFailed: MarkContentFailedUseCase,
  ) {}

  async onModuleInit() {
    const consumer = this.kafkaService.consumer
    await consumer.subscribe({ topic: 'content.processed', fromBeginning: false })
    await consumer.subscribe({ topic: 'content.processing', fromBeginning: false })
    await consumer.subscribe({ topic: 'content.failed', fromBeginning: false })
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return
        const event = JSON.parse(message.value.toString())
        if (topic === 'content.processed') {
          await this.markProcessed.execute(event.contentId)
        } else if (topic === 'content.processing') {
          await this.markProcessing.execute(event.contentId)
        } else if (topic === 'content.failed') {
          await this.markFailed.execute(event.contentId) 
        }
      },
    })
  }
}
