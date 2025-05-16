import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

// let hono app knows that there are other variables have been set
// https://hono.dev/docs/api/hono#generics
interface CustomAppBindings {
  Variables: {
    logger: PinoLogger,
    slogan: 'hono rocks' // you can customize any variable, and c.var will have it: c.var.slogan
  }
}

type AppOpenAPI = OpenAPIHono<CustomAppBindings>

// Create the utility type alias
// Each AppRouteHandler type needs to be defined using the RouteConfig type, do not need to specify the CustomAppBindings type
// because it's already defined in the RouteHandler type
// used in the tasks.handlers.ts file
type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, CustomAppBindings>


export type { AppOpenAPI, AppRouteHandler, CustomAppBindings }
