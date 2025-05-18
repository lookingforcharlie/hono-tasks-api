// extract the app into a separate file to separate it from the node server
// because hono is agnostic to runtime
import { OpenAPIHono } from '@hono/zod-openapi'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'
import { defaultHook } from 'stoker/openapi'

import type { CustomAppBindings } from '@/lib/types'

import { pinoLogger } from '@/middlewares/pino-logger'

// create a stand alone router instance with any middlewares
export function createRouter() {
  // with strict set to false, /error and /error/ will be treated as the same path
  // defaultHook: return validation errors as a json response
  return new OpenAPIHono<CustomAppBindings>({
    strict: false,
    defaultHook, // Default hook source code : https://github.com/w3cj/stoker/blob/main/src/openapi/default-hook.ts
  })
}

// reusable function to create a new app and include the middlewares
// we can call this when testing
export default function createApp() {
  const app = createRouter()

  app.use(serveEmojiFavicon('⛲'))
  app.use(pinoLogger())
  app.notFound(notFound)
  app.onError(onError)

  return app
}
