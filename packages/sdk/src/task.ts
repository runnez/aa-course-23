import { z } from 'zod';

export const NewTaskSchema = z.object({
  description: z.string(),
  assigneeId: z.number(),
})

export const TaskSchema = z.object({
  id: z.number(),
  description: z.string(),
  assigneeId: z.number(),
  resolved: z.boolean(),
});

export const CreateTaskEndpoint = {
  body: z.object({
    task: NewTaskSchema
  }),
  response: z.object({
    task: TaskSchema,
  }),
}

export const GetTasksEndpoint = {
  response: z.object({
    tasks: z.array(TaskSchema),
  }),
}