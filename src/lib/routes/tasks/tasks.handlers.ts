import * as HttpStatusCodes from 'stoker/http-status-codes'

import type { AppRouteHandler } from '../../types'
import type { ListRoute } from './tasks.routes'

// Create route handler
// ListRoute is the RouteConfig created in the tasks.routes.ts file
export const list: AppRouteHandler<ListRoute> = (c) => {
  c.var.logger.info('Listing tasks')
  console.log(c.var.slogan)
  console.log('--------------- context begins -----------------')
  console.log(c)
  console.log('--------------- context ends -----------------')
  return c.json([
    { name: 'Task 1', done: false },
    { name: 'Task 2', done: true },
  ], HttpStatusCodes.OK)
}

// original type
// RouteHandler is a generic type, we need to specify it
// const list: RouteHandler<ListRoute, CustomAppBindings> = c => { … }
