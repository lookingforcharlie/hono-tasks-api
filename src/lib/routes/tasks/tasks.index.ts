import { createRouter } from '@/lib/create-app'

import * as handlers from './tasks.handlers'
import * as routes from './tasks.routes'

// route definition and route handler are separated in different files to keep the main file clean
const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOneById, handlers.getOneById)
  .openapi(routes.patchById, handlers.patchById)
  .openapi(routes.deleteById, handlers.deleteById)

export default router

// This is the index file, it's the entry point for the tasks routes
// Once we have route definition in tasks.routes.ts and route handler in tasks.handlers.ts, we need to smack them together and actually add them to the api
