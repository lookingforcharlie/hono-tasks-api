// extract the app into a separate file to separate it from the node server
// because hono is agnostic to runtime

import type { Schema } from 'hono'

import { OpenAPIHono } from '@hono/zod-openapi'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'
import { defaultHook } from 'stoker/openapi'

import type { AppOpenAPI, CustomAppBindings } from '@/lib/types'

import { pinoLogger } from '@/middlewares/pino-logger'

// create a stand alone router instance with any middlewares
export function createRouter() {
  // with strict set to false, /error and /error/ will be treated as the same path
  // defaultHook: return validation errors as a json response
  // defaultHook runs if there's ever a validation error from an openapi route handler and it's not handled by the route handler itself
  return new OpenAPIHono<CustomAppBindings>({
    strict: false, // localhost:9999/error and localhost:9999/error/ will be treated as the same path
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

// create a app dedicated for testing with the router mounted on it, now we can get the response from the router when testing
export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  // now testApp is inferred as Hono<CustomAppBindings, S>
  const testApp = createApp().route('/', router)
  return testApp
}

// this version doesn't return a full typed app, but a router, because TS inference works better with chaining
// export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
//   const testApp = createApp()
//   testApp.route('/', router) // mount the router on the test app
//   return testApp
// }
