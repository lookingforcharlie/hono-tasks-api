import { eq } from 'drizzle-orm'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import db from '@/db'
import { tasks } from '@/db/schema'

import type { AppRouteHandler } from '../../types'
import type { CreateRoute, GetOneByIdRoute, ListRoute, PatchByIdRoute } from './tasks.routes'

// Create route handler
// ListRoute is the RouteConfig created in the tasks.routes.ts file
export const list: AppRouteHandler<ListRoute> = async (c) => {
  c.var.logger.info('Listing tasks')

  // query the database
  const tasks = await db.query.tasks.findMany()
  return c.json(tasks, HttpStatusCodes.OK)
}

// original type
// RouteHandler is a generic type, we need to specify it
// const list: RouteHandler<ListRoute, CustomAppBindings> = c => { … }

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  // the code will never reach this point if the request body is invalid
  // task: { name: string, done: boolean }
  const task = c.req.valid('json')
  // returning() returns the array of inserted rows, even if it's only one row
  // [insertedTask]: array destructuring takes the first element of the array, because it's guaranteed to be one row here, insertedTask is always the inserted row
  const [insertedTask] = await db.insert(tasks).values(task).returning()
  return c.json(insertedTask, HttpStatusCodes.OK)
}

export const getOneById: AppRouteHandler<GetOneByIdRoute> = async (c) => {
  // the code will never reach this point if the id is invalid
  const params = c.req.valid('param') // we can also destructure the id: { id: number }
  const task = await db.query.tasks.findFirst({
    where(fields, operator) {
      return operator.eq(fields.id, params.id) // fields here is the fields of the tasks table
    },
  })
  if (!task) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND)
  }
  return c.json(task, HttpStatusCodes.OK)
}

// why create doesn't need to deal with errors?

// create handler for updating/patching a task by id
export const patchById: AppRouteHandler<PatchByIdRoute> = async (c) => {
  const params = c.req.valid('param')
  const updates = c.req.valid('json') // you can just send name or done or both

  // eq is a helper function from drizzle-orm, pass in the columns we are comparing and the value we are comparing it to
  // it will return a list of updated rows, even if it's only one row
  const [updatedTask] = await db.update(tasks).set(updates).where(eq(tasks.id, params.id)).returning()

  if (!updatedTask) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND)
  }

  return c.json(updatedTask, HttpStatusCodes.OK)
}
