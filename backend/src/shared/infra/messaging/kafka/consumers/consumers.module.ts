import { Module } from '@nestjs/common'
import { KafkaModule } from '../kafka.module';
import { KafkaConsumerRunner } from './kafka-consumer.runner';

@Module({
  imports: [KafkaModule],
  providers: [KafkaConsumerRunner],
})
export class MessagingConsumersModule {}
