import { Event, EventTopic } from 'sdk';
import { handleAccountEvent } from './consumers/account.consumer';
import { kafka } from './lib/kafka';

const consumer = kafka.consumer({ groupId: 'jira' })

export const attachConsumers = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: EventTopic.account });
  console.log('attachConsumers subscribed');
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      console.log('eachMessage topic', topic);
      const event = JSON.parse(message.value?.toString() || '{}') as Event;
      if (topic === EventTopic.account) {
        await handleAccountEvent(event);
      }
    },
  })
}