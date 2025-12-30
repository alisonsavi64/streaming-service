import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Kafka, Producer, Consumer } from 'kafkajs'

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka
  private readonly producerInstance: Producer
  private readonly consumerInstance: Consumer

  constructor() {
    this.kafka = new Kafka({
      clientId: 'backend',
      brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    })

    this.producerInstance = this.kafka.producer()
    this.consumerInstance = this.kafka.consumer({
      groupId: 'backend-group',
    })
  }

  async onModuleInit() {
    await this.producerInstance.connect()
    await this.consumerInstance.connect()
  }

  async onModuleDestroy() {
    await this.producerInstance.disconnect()
    await this.consumerInstance.disconnect()
  }

  get producer(): Producer {
    return this.producerInstance
  }

  get consumer(): Consumer {
    return this.consumerInstance
  }
}
