import { Event, EventName } from "sdk";
import { Task } from "../models/task.model";
import { applyTransaction } from "../services/transaction.service";

export async function handleTaskEvent(event: Event) {
  const { payload, name, version } = event;
  switch (name) {
    case EventName.TaskCreated: {
      if (version === 1) {
        await Task.insert({
          id: payload.task.id,
          description: payload.task.description,
          fee: getRandomFee(),
          reward: getRandomReward(),
        });
      }
      if (version === 2) {
        await Task.insert({
          id: payload.task.id,
          description: `--[${payload.task.jiraId}]--${payload.task.description}`,
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