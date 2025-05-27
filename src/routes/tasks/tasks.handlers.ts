import { eq } from 'drizzle-orm'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import db from '@/db'
import { tasks } from '@/db/schema'
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants'

import type { AppRouteHandler } from '../../lib/types'
import type { CreateRoute, DeleteByIdRoute, GetOneByIdRoute, ListRoute, PatchByIdRoute } from './tasks.routes'

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
  const params = c.req.valid('param') // id is a string, even if it's a number in the database
  const updates = c.req.valid('json') // you can just send name or done or both

  // handle the empty updates: no name and no done
  // Object.keys(updates).length: check if the updates object is empty
  if (Object.keys(updates).length === 0) {
    // MARK: what decides the shape of json response?
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ZodError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY, // HTTP status code (422) is sent in the response headers, not in the JSON body.
    )
  }
  // eq is a helper function from drizzle-orm, pass in the columns we are comparing and the value we are comparing it to
  // .returning() send back the full row(s) that were updated: return a list of updated rows, even if it's only one row
  const [updatedTask] = await db.update(tasks).set(updates).where(eq(tasks.id, params.id)).returning()

  if (!updatedTask) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND)
  }

  return c.json(updatedTask, HttpStatusCodes.OK)
}

// create handler for deleting a task by id
export const deleteById: AppRouteHandler<DeleteByIdRoute> = async (c) => {
  // .valid() async is available only when you've attached a Zod schema to your route's request definition using createRoute() in tasks.routes.ts file
  const params = c.req.valid('param') // safely returns parsed and validated URL params and gives you { id: string }
  // ResultSet shape here from sqlite driver if task is not found:
  // { columns: [],
  // columnTypes: [],
  // rows: [],
  // rowsAffected: 0,
  // lastInsertRowid: 0n }
  const result = await db.delete(tasks).where(eq(tasks.id, params.id)) // safely returns parsed and validated request body (JSON) and gives you { name?: string, done?: boolean }
  console.log('result returned from db.delete()', result)

  if (result.rowsAffected === 0) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND)
  }
  return c.body(null, HttpStatusCodes.NO_CONTENT) // 204
}
