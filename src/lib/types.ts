import type { OpenAPIHono } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

// let hono app knows that there are other variables have been set
// https://hono.dev/docs/api/hono#generics
interface CustomAppBindings {
  Variables: {
    logger: PinoLogger
  }
}

type AppOpenAPI = OpenAPIHono<CustomAppBindings>

export type { AppOpenAPI, CustomAppBindings }
