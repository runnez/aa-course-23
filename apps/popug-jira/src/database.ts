import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { TaskTable } from './models/task.model'
import { AccountTable } from './models/account.model';

export interface Database {
  accounts: AccountTable;
  tasks: TaskTable
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'popugdb',
    host: 'localhost',
    user: 'popugdbdbuser',
    port: 5434,
    max: 10,
  })
});

export const db = new Kysely<Database>({
  dialect,
});