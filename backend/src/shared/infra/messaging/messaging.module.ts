import { Global, Module } from '@nestjs/common'
import { KafkaModule } from './kafka/kafka.module'
import { KafkaEventBusAdapter } from './kafka/kafka-event-bus.adapter'
import { MessagingConsumersModule } from './kafka/consumers/consumers.module'

@Global()
@Module({
  imports: [KafkaModule, MessagingConsumersModule],
  providers: [
    {
      provide: 'EventBus',
      useClass: KafkaEventBusAdapter,
    },
  ],
  exports: ['EventBus'],
})
export class MessagingModule {}
