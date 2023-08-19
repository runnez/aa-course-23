import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { createTask } from '../models/task.model';
import { sdk } from '../sdk';

export const createTaskRoute = createRouteSpec({
  method: 'post',
  path: '/tasks',
  handler: async (ctx) => {
    const { description, assigneeId } = ctx.request.body.task;
    await sdk.auth.verify();
    // auth
    // assigneeId ???
    const task = await createTask({
      description,
      assigneeId,
    });
    // produce task.created event
    ctx.body = {
      task,
    };
  },
  validate: {
    body: z.object({
      task: z.object({
        description: z.string(),
        assigneeId: z.number(),
      })
    }),
    response: z.object({
      task: z.object({
        id: z.number(),
        description: z.string(),
        assigneeId: z.number(),
      }),
    }),
  },
});

export const assignPendingTasksRoute = createRouteSpec({
  method: 'post',
  path: '/tasks/assign',
  handler: async (ctx) => {
    // auth
    // getPopugWorkers()
    // getPendingTasks()
    // assignRandomlyStepByStep();
    // produce task.assignedEvent
  },
  validate: {},
});