import { CreateTaskEndpoint, EventName, EventTopic, GetTasksEndpoint } from 'sdk';
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
  validate: GetTasksEndpoint,
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
    await sendEvent(EventTopic.task, [
      { name: EventName.TaskCreated, payload: { task } },
      { name: EventName.TaskAssigned, payload: { taskId: task.id } }
    ]);
    ctx.body = {
      task,
    };
  },
  validate: CreateTaskEndpoint,
});

export const shufflePendingTasksRoute = specFactory.createRouteSpec({
  method: 'post',
  path: '/tasks/shuffe',
  handler: async (ctx) => {
    const accounts = await findUserAccounts();
    const pendingTasks = await findPendingTasks();
    for (const task of pendingTasks) {
      const assigneeId = accounts[getRandomInt(accounts.length - 1)].id;
      await updateTask(task.id, {
        assigneeId,
      });
      await sendEvent(EventTopic.task, { name: EventName.TaskAssigned, payload: { taskId: task.id } });
    }
    ctx.status = 204;
  },
  validate: {},
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}