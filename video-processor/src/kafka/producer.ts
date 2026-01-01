import { kafka } from './client';

let producer: ReturnType<typeof kafka.producer> | null = null;
let connected = false;
let connecting: Promise<void> | null = null;

async function connectProducer() {
  if (connected) return;

  if (!connecting) {
    connecting = (async () => {
      while (true) {
        try {
          console.log('Connecting Kafka producer...');
          producer = kafka.producer();
          await producer.connect();
          connected = true;
          console.log('Kafka producer connected');
          break;
        } catch (err) {
          console.error('Kafka unavailable, retrying in 5s');
          await new Promise(r => setTimeout(r, 5000));
        }
      }
    })();
  }

  await connecting;
}

export async function sendKafkaMessage(
  topic: string,
  key: string,
  value: any
) {
  await connectProducer();

  try {
    await producer!.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
  } catch (err) {
    console.error('Failed to send Kafka message', err);
  }
}
