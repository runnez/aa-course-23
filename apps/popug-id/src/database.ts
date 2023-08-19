import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { AccountTable } from './models/account.model'

export interface Database {
  accounts: AccountTable
}

const dialect = new PostgresDialect({
  pool: new Pool({
    host: 'localhost',
    database: 'popugdb',
    user: 'popugdbuser',
    password: 'popugdbpassword',
  })
});

export const db = new Kysely<Database>({
  dialect,
});