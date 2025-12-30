import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../application/messaging/event-bus.port'
import { KafkaService } from './kafka.service'

@Injectable()
export class KafkaEventBusAdapter implements EventBus {
  constructor(private readonly kafkaService: KafkaService) {}

  async publish<T>(topic: string, event: T): Promise<void> {
    await this.kafkaService.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    })
  }
}
