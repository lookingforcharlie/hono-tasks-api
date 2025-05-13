import { pinoLogger as logger } from 'hono-pino'
import pino from 'pino'
import pretty from 'pino-pretty'

import env from '../env'

export function pinoLogger() {
  return logger({
    // Try NODE_ENV=production pn run dev in terminal, you will see the logger without pretty, because we need consume all the logger content in production mode
    pino: pino({
      level: env.LOG_LEVEL || 'info',
    }, env.NODE_ENV === 'production' ? undefined : pretty()),
    http: {
      reqId: () => crypto.randomUUID(), // make request id unique instead of adding it up by default
    },
  })
}

// set up the pinoLogger as middleware
