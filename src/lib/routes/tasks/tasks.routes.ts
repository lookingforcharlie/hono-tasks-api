// we will response with an array of tasks

import { createRouter } from "../../create-app";

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";

const tags = ['tasks']
// create route definition
export const list = createRoute({
  tags,
  path: '/tasks',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(z.object({
        name: z.string(),
        done: z.boolean(),
      })), 
      'The list of tasks'
    )
  }
})

// This is the type that defines the specific route, we need to use it when we're defining our handler
export type ListRoute = typeof list