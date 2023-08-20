import { z } from 'zod';
import { specFactory } from '../app';
import { sendEvent } from '../lib/kafka';
import { findUserAccounts } from '../models/account.model';
import { createTask, findPendingTasks, findTasksByAssigneeId, updateTask } from '../models/task.model';

export const getTasksRoute = specFactory.createRouteSpec({
  method: 'get',
  path: '/tasks',
  handler: async (ctx) => {
    const tasks = await findTasksByAssigneeId(ctx.state.account.accountId);
    ctx.body = {
      tasks,
    };
  },
  validate: {
    response: z.object({
      tasks: z.array(z.object({
        id: z.number(),
        description: z.string(),
        assigneeId: z.number(),
        resolved: z.boolean(),
      })),
    }),
  },
});

export const createTaskRoute = specFactory.createRouteSpec({
  method: 'post',
  path: '/tasks',
  handler: async (ctx) => {
    const { description, assigneeId } = ctx.request.body.task;
    const task = await createTask({
      description,
      assigneeId,
      resolved: false,
    });
    await sendEvent('task', { name: 'taskCreated', payload: { task } });
    await sendEvent('jira', { name: 'taskAssigned', payload: { taskId: task.id, assigneeId: assigneeId } });
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
        resolved: z.boolean(),
      }),
    }),
  },
});

export const assignPendingTasksRoute = specFactory.createRouteSpec({
  method: 'post',
  path: '/tasks/assign',
  handler: async (ctx) => {
    const accounts = await findUserAccounts();
    const pendingTasks = await findPendingTasks();
    for (const task of pendingTasks) {
      const assigneeId = accounts[getRandomInt(accounts.length - 1)].id;
      await updateTask(task.id, {
        assigneeId,
      });
      await sendEvent('jira', { name: 'taskAssigned', payload: { taskId: task.id, assigneeId: assigneeId } });
    }
    ctx.status = 204;
  },
  validate: {},
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}