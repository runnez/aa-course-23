import z from 'zod';
import { AccountSchema } from './account';
import { TaskSchema } from './task';

export enum EventName {
  AccountCreated = 'AccountCreated',
  TaskCreated = 'TaskCreated',
  TaskAssigned = 'TaskAssigned',
}

export enum EventTopic {
  task = 'task-streaming',
  account = 'account-streaming',
}

export const AccountCreatedSchema = z.object({
  account: AccountSchema
});

export const TaskCreatedSchema = z.object({
  task: TaskSchema,
})

export const EventSchema =
  z.discriminatedUnion('name', [
    z.object({
      name: z.literal(EventName.AccountCreated),
      payload: AccountCreatedSchema,
    }),
    z.object({
      name: z.literal(EventName.TaskCreated),
      payload: TaskCreatedSchema,
    }),
    z.object({
      name: z.literal(EventName.TaskAssigned),
      payload: z.object({
        taskId: z.number(),
      }),
    })
  ])

export type Event = z.infer<typeof EventSchema>;

export type AccountCreated = z.infer<typeof AccountCreatedSchema>;