import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { TaskTable } from './models/task.model'
import { AccountTable } from './models/account.model';
import { dbPort } from './config';

export interface Database {
  accounts: AccountTable;
  tasks: TaskTable
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'popugdb',
    host: 'localhost',
    password: 'popugdbpassword',
    user: 'popugdbuser',
    port: dbPort,
    max: 10,
  })
});

export const db = new Kysely<Database>({
  dialect,
});