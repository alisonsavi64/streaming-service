import { Module } from '@nestjs/common'
import { KafkaModule } from '../kafka.module'
import { KafkaConsumerRunner } from './kafka-consumer.runner'
import { ContentModule } from '../../../../../content/content.module'

@Module({
  imports: [
    KafkaModule,
    ContentModule
  ],
  providers: [KafkaConsumerRunner],
})
export class MessagingConsumersModule { }
