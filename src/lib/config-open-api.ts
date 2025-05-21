// pass in hono app
// add /doc endpoint
// add /reference endpoint
import { Scalar } from '@scalar/hono-api-reference'

import type { AppOpenAPI } from './types'

import packageJSON from '../../package.json'

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: packageJSON.version,
      description: 'API for managing tasks',
    },
  })

  // get api reference interface: scalar
  app.get('/reference', Scalar({
    theme: 'laserwave',
    layout: 'classic',
    defaultHttpClient: {
      targetKey: 'js',
      clientKey: 'fetch',
    },
    url: '/doc',
  }))
}
