import { processAccountEvent } from './consumers/account.consumer'
import { kafka } from './lib/kafka'

const consumer = kafka.consumer({ groupId: 'test-group' })

export const attachConsumers = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'account' })
  console.log('attachConsumers subscribed');
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      console.log('eachMessage topic', topic);
      const event = JSON.parse(message.value?.toString() || '{}');
      if (topic === 'account') {
        await processAccountEvent(event)
      }
    },
  })
}