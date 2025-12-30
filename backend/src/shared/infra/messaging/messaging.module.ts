import { Module } from '@nestjs/common'
import { KafkaModule } from './kafka/kafka.module'
import { KafkaEventBusAdapter } from './kafka/kafka-event-bus.adapter'

@Module({
  imports: [KafkaModule],
  providers: [
    {
      provide: 'EventBus',
      useClass: KafkaEventBusAdapter,
    },
  ],
  exports: ['EventBus'],
})
export class MessagingModule {}
