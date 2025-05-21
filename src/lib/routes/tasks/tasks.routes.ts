// we will response with an array of tasks

import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContentOneOf, jsonContentRequired } from 'stoker/openapi/helpers'
import jsonContent from 'stoker/openapi/helpers/json-content'
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas'

import { insertTaskSchema, patchTaskSchema, selectTasksSchema } from '@/db/schema'
import { notFoundSchema } from '@/lib/constants'

const tags = ['tasks']

// create route definition for listing all tasks
export const list = createRoute({
  tags,
  path: '/tasks',
  method: 'get',
  responses: {
    // 200: OK
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema), // schema validator, it will validate the response body
      'The list of tasks',
    ),
  },
})

// create route definition for creating a task
export const create = createRoute({
  tags,
  path: '/tasks',
  method: 'post',
  request: {
    body: jsonContentRequired(
      insertTaskSchema, // validate the request body
      'The task to create',
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema, // return the exact single task that was created
      'The created task',
    ),
    // 422: Unprocessable Entity
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      // we need a schema that describes all of the possible issues
      createErrorSchema(selectTasksSchema),
      'The validation error',
    ),
  },
})

// We need to validate the incoming request body before we insert it into the database

// create route definition for getting a task by id
export const getOneById = createRoute({
  tags,
  path: '/tasks/{id}',
  method: 'get',
  request: {
    params: IdParamsSchema, // validate the params: id parameter
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema, // return a single task
      'The requested task',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'The task not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid ID error',
    ),
  },
})

// create a patch route for updating an existing task by Id: this one will be a combination of getOneById route and create route
export const patchById = createRoute({
  tags,
  path: '/tasks/{id}',
  method: 'patch',
  request: {
    params: IdParamsSchema, // validate the params
    body: jsonContentRequired(
      patchTaskSchema, // as same as insertTaskSchema here
      'The task updates',
    ), // validate the request body
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      'The updated task',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'The task not found',
    ),
    // jsonContent helper function accepts a zod union type
    // anyOf in JSON leads to a lot of problem in code generation
    // so we want oneOf instead of anyOf
    // here is jsonContentOneOf helper function kicks in
    // [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
    //   createErrorSchema(patchTaskSchema).or(createErrorSchema(IdParamsSchema)),
    //   'The validation error',
    // ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      // jsonContent helper function accepts a zod union type
      [
        createErrorSchema(patchTaskSchema), // validation error in the body
        createErrorSchema(IdParamsSchema), // validation error in the url params
      ],
      'The validation error(s)',
    ),
    // ? how to use code generation
  },
})

// create a delete route for deleting a task by id
export const deleteById = createRoute({
  tags,
  path: '/tasks/{id}',
  method: 'delete',
  request: {
    params: IdParamsSchema, // validate the params
    // we don't expect any request body for delete request
  },
  // when delete successfully, we won't response with the deleted task from database
  // we will response with a message of 204
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'The task deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'The task not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid ID error',
    ),
  },
})

// This is the type that defines the specific route, we need to use it when we're defining our handler
export type ListRoute = typeof list
export type CreateRoute = typeof create
export type GetOneByIdRoute = typeof getOneById
export type PatchByIdRoute = typeof patchById
export type DeleteByIdRoute = typeof deleteById
