import { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { db } from '../database';

export interface AccountTable {
  id: Generated<number>;
  role: string;
  email: string;
}

export type Account = Selectable<AccountTable>
export type NewAccount = Insertable<AccountTable>
export type AccountUpdate = Updateable<AccountTable>

export const createAccount = async ({ ...newAccount }: NewAccount) => {
  return db.insertInto('accounts').values({ ...newAccount }).returningAll().executeTakeFirstOrThrow()!;
}

export const getWorkers = async () => {
  const account = await db
    .selectFrom('accounts')
    .selectAll()
    .where('accounts.role', '=', 'worker')
    .executeTakeFirst();
  return account;
}