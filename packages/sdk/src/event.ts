import z from 'zod';
import { AccountSchema } from './account';
import { TaskSchema, TaskSchemaV2 } from './task';

export enum EventName {
  AccountCreated = 'AccountCreated',
  TaskCreated = 'TaskCreated',
  TaskAssigned = 'TaskAssigned',
  TaskResolved = 'TaskResolved',
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

export const TaskCreatedSchemaV2 = z.object({
  task: TaskSchemaV2,
})

export const EventSchema =
  z.discriminatedUnion('name', [
    z.object({
      name: z.literal(EventName.AccountCreated),
      payload: AccountCreatedSchema,
    }),
    z.object({
      name: z.literal(EventName.TaskCreated),
      version: z.literal(1),
      payload: TaskCreatedSchema,
    }),
    z.object({
      name: z.literal(EventName.TaskCreated),
      version: z.literal(2),
      payload: TaskCreatedSchemaV2,
    }),
    z.object({
      name: z.literal(EventName.TaskAssigned),
      payload: z.object({
        taskId: z.number(),
        assigneeId: z.number(),
      }),
    }),
    z.object({
      name: z.literal(EventName.TaskResolved),
      payload: z.object({
        taskId: z.number(),
        assigneeId: z.number(),
      }),
    })
  ])

export type Event = z.infer<typeof EventSchema>;

export type AccountCreated = z.infer<typeof AccountCreatedSchema>;