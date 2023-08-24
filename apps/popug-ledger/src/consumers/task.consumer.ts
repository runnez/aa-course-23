import { Event, EventName } from "sdk";
import { Task } from "../models/task.model";
import { applyTransaction } from "../services/transaction.service";

export async function handleTaskEvent(event: Event) {
  const { payload, name } = event;
  switch (name) {
    case EventName.TaskCreated: {
      if (event.version === 1) {
        await Task.insert({
          id: payload.task.id,
          description: event.payload.task.description,
          fee: getRandomFee(),
          reward: getRandomReward(),
        });
      }
      if (event.version === 2) {
        await Task.insert({
          id: payload.task.id,
          description: `--[${event.payload.task.jiraId}]--${event.payload.task.description}`,
          fee: getRandomFee(),
          reward: getRandomReward(),
        });
      }
      break;
    }
    case EventName.TaskAssigned: {
      const task = await Task.findOneByOrFail({ id: payload.taskId });
      await applyTransaction(payload.assigneeId, -task.fee, task.description);
      break;
    }
    case EventName.TaskResolved: {
      const task = await Task.findOneByOrFail({ id: payload.taskId });
      await applyTransaction(payload.assigneeId, task.reward, task.description);
      break;
    }
  }
}

function getRandomFee() {
  return 10;
}
function getRandomReward() {
  return 40;
}