import { testClient } from 'hono/testing'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ZodIssueCode } from 'zod'

import env from '@/env'
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants'
import { createTestApp } from '@/lib/create-app'

import router from './tasks.index'

// usually this code won't be run, because Vitest automatically sets NODE_ENV=test when running tests
// create an isolated database for testing
if (env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV is not set to "test"')
}

// client is fully typed test client
const client = testClient(createTestApp(router))

describe('tasks Routers', () => {
  // create an isolated database for testing
  beforeAll(async () => {
    execSync('pnpm drizzle-kit push')
  })

  // delete the test.db file after all tests
  afterAll(async () => {
    fs.rmSync('test.db', { recursive: true, force: true })
  })

  it('post /tasks validates the body when creating', async () => {
    const response = await client.tasks.$post({
      // @ts-expect-error - we are testing the validation not setting the required field name
      json: {
        done: false,
      },
    })
    expect(response.status).toBe(422)
    if (response.status === 422) {
      const json = await response.json()
      // MARK: why the path is name and the message is Required?
      expect(json.error.issues[0].path[0]).toBe('name')
      // ZOD_ERROR_MESSAGES.REQUIRED === 'Required'
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED)
    }
  })

  const id = 1
  const name = 'hello from vitest'

  it('post /tasks creates a task', async () => {
    const response = await client.tasks.$post({
      json: {
        name,
        done: false,
      },
    })
    expect(response.status).toBe(200)
    if (response.status === 200) {
      const json = await response.json()
      expect(json.name).toBe(name)
      expect(json.done).toBe(false)
      expect(json.id).toBe(id)
    }
  })

  // .request() is like fetch(), it's a get request by default
  // We get 404 not found without responding json object, cos we are accessing the router directly now, and there's no middleware to handle the request
  // Issue solved by creating createTestApp function, now we can get the response from the router when testing
  it('get /tasks lists all tasks', async () => {
    const response = await client.tasks.$get()
    expect(response.status).toBe(200)
    if (response.status === 200) {
      const json = await response.json()
      expect(json).toBeInstanceOf(Array)
      expect(json.length).toBe(1)
    }
  })

  it('get /tasks/:id validates the id param', async () => {
    // This is equivalent to making a GET request to /tasks/wat
    // It's a dynamic parameter (denoted by the : prefix)
    // client.tasks[':id'], you're using bracket notation to access a dynamic route parameter. The :id is a special syntax that Hono's test client uses to represent URL parameters.
    const response = await client.tasks[':id'].$get({
      // @ts-expect-error - we are testing the validation
      param: { id: 'wat' }, // why I changed param to another word, it still works?
    })
    expect(response.status).toBe(422)
    if (response.status === 422) {
      const json = await response.json()
      expect(json.error.issues[0].path[0]).toBe('id')
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER)
    }
  })

  it('get /tasks/:id returns 404 when task not found', async () => {
    const response = await client.tasks[':id'].$get({
      param: { id: 999 },
    })
    expect(response.status).toBe(404)
    if (response.status === 404) {
      const json = await response.json()
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND)
    }
  })

  it('get /tasks/{id} returns a single task', async () => {
    const response = await client.tasks[':id'].$get({
      param: { id },
    })
    expect(response.status).toBe(200)
    if (response.status === 200) {
      const json = await response.json()
      expect(json.name).toBe(name)
      expect(json.done).toBe(false)
    }
  })

  it('patch /tasks/{id} validates the body when updating', async () => {
    const response = await client.tasks[':id'].$patch({
      param: { id },
      json: {
        name: '',
      },
    })
    expect(response.status).toBe(422)
    if (response.status === 422) {
      const json = await response.json()
      expect(json.error.issues[0].path[0]).toBe('name')
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small)
    }
  })

  it('patch /tasks/{id} validates the id param', async () => {
    const response = await client.tasks[':id'].$patch({
      // @ts-expect-error - we are testing the validation
      param: { id: 'wat' },
      json: {},
    })
    expect(response.status).toBe(422)
    if (response.status === 422) {
      const json = await response.json()
      expect(json.error.issues[0].path[0]).toBe('id')
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER)
    }
  })

  it('patch /tasks/{id} validates the empty body', async () => {
    const response = await client.tasks[':id'].$patch({
      param: { id },
      json: {},
    })

    expect(response.status).toBe(422)
    if (response.status === 422) {
      const json = await response.json()
      // console.log('json', JSON.stringify(json, null, 2))
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES)
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES)
    }
  })

  it('patch /tasks/{id} updates a single property of a task', async () => {
    const response = await client.tasks[':id'].$patch({
      param: { id },
      json: {
        done: true,
      },
    })
    expect(response.status).toBe(200)
    if (response.status === 200) {
      const json = await response.json()
      expect(json.done).toBe(true)
    }
  })

  it('delete /tasks/{id} validates the id when deleting', async () => {
    const response = await client.tasks[':id'].$delete({
      // @ts-expect-error - we are testing the validation
      param: { id: 'wat' },
    })
    expect(response.status).toBe(422)
    if (response.status === 422) {
      const json = await response.json()
      expect(json.error.issues[0].path[0]).toBe('id')
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER)
    }
  })

  it('delete /tasks/{id} deletes a task', async () => {
    const response = await client.tasks[':id'].$delete({
      param: { id },
    })
    expect(response.status).toBe(204)
  })
})
