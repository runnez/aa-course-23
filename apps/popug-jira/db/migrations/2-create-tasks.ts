import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('tasks')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('assigneeId', 'integer', (col) => col.references('accounts.id'))
    .addColumn('description', 'varchar')
    .addColumn('resolved', 'boolean', (col) => col.defaultTo(false))
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('accounts').execute()
}