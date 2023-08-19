import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { db } from '../database';

export interface TaskTable {
  id: Generated<number>;
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

export const findTasksByAssigneeId = async (id: number) => {
  const account = await db
    .selectFrom('tasks')
    .selectAll()
    .where('tasks.assigneeId', '=', id)
    .executeTakeFirst();
  return account;
}