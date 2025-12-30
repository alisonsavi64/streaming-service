import { Injectable, OnModuleInit } from '@nestjs/common'
import { KafkaService } from '../kafka.service'
import { MarkContentProcessedUseCase } from '../../../../../content/application/mark-content-processed.use-case'

@Injectable()
export class KafkaConsumerRunner implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly markProcessed: MarkContentProcessedUseCase,
  ) {}

  async onModuleInit() {
    const consumer = this.kafkaService.consumer

    await consumer.subscribe({
      topic: 'content.processed',
      fromBeginning: false,
    })

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return

        const event = JSON.parse(message.value.toString())
        await this.markProcessed.execute(
          event.contentId,
          event.processedPath,
        )
      },
    })
  }
}
