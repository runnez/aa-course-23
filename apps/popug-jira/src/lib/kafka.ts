import { Kafka } from 'kafkajs';
import { Event, EventTopic } from 'sdk';

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const producer = kafka.producer();

export const sendEvent = async (topic: EventTopic, data: Event | Event[]) => {
  const messages = data instanceof Array ? data : [data];
  console.log('sending event', topic, messages);
  await producer.connect();
  await producer.send({
    topic,
    messages: messages.map(event => (
      {
        key: 'event',
        value: JSON.stringify(event),
      }
    )),
  });
}

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type as any, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})