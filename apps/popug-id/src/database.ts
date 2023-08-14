import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export interface Database {}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'popugdb',
    host: 'localhost',
    user: 'popugdbdbuser',
    port: 5434,
    max: 10,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
})