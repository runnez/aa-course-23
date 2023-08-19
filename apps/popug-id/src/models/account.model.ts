import bcrypt from 'bcrypt'
import { ColumnType, Generated, Insertable, Selectable, Transaction, Updateable } from 'kysely'
import { Database, db } from '../database';

export interface AccountTable {
  id: Generated<number>;
  role: string;
  email: string;
  password: string;
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Account = Selectable<AccountTable>
export type NewAccount = Insertable<AccountTable>
export type AccountUpdate = Updateable<AccountTable>

export const createAccount = async ({ password, ...newAccount }: NewAccount, { trx }: { trx?: Transaction<Database> } = {}) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return (trx || db).insertInto('accounts').values({
    ...newAccount,
    password: encryptedPassword,
  }).returningAll().executeTakeFirstOrThrow();
}

export const findAccountByEmailAndPassword = async (username: string, password: string) => {
  const account = await db
    .selectFrom('accounts')
    .selectAll()
    .where('accounts.email', '=', username)
    .executeTakeFirst();
  if (!account) {
    return null;
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  if (account.password !== encryptedPassword) {
    return null;
  }
  return account;
}

export const findAccountById = async (id: number) => {
  const account = await db
    .selectFrom('accounts')
    .selectAll()
    .where('accounts.id', '=', id)
    .executeTakeFirst();
  return account;
}