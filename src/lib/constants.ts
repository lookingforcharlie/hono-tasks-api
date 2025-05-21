import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { createMessageObjectSchema } from 'stoker/openapi/schemas'

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: 'Required',
  EXPECTED_NUMBER: 'Expected number, received nan',
  NO_UPDATES: 'No updates provided',
}

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: 'invalid_updates',
}

// any endpoint that needs to respond with not found, can use this validator
export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND)
