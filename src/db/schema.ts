import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// sqlite column types docs: https://orm.drizzle.team/docs/column-types/sqlite

const defaultNow = sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`

// In sqlite, there is no boolean type, so we use integer with 0 or 1 to represent boolean
// In sqlite, there is no timestamp type
export const tasks = sqliteTable('tasks', {
  // specify the column name and the type
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(defaultNow),
  // createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(defaultNow).$onUpdate(() => new Date()),
  // updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
})

// $defaultFn(() => new Date()) doesn't work in drizzle studio, idk why