import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { db } from '../database';

export interface TaskTable {
  id: Generated<number>;
  resolved: boolean
  assigneeId: number;
  description: string;
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Task = Selectable<TaskTable>
export type NewTask = Insertable<TaskTable>
export type TaskUpdate = Updateable<TaskTable>

export const createTask = async ({ ...newAccount }: Omit<NewTask, 'id'>) => {
  return db.insertInto('tasks').values({
    ...newAccount,
  }).returningAll().executeTakeFirstOrThrow()!;
}

export const updateTask = (id: number, taskUpdate: TaskUpdate) => {
  return db.updateTable('tasks').where('id', '=', id).set(taskUpdate).execute();
}

export const findTasksByAssigneeId = async (id: number) => {
  const tasks = await db
    .selectFrom('tasks')
    .selectAll()
    .where('tasks.assigneeId', '=', id)
    .execute();
  return tasks;
}

export const findPendingTasks = async () => {
  const tasks = await db
    .selectFrom('tasks')
    .selectAll()
    .where('tasks.resolved', '=', false)
    .execute();
  return tasks;
}