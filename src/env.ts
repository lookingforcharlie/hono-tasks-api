import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

expand(config())

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(9999), // turn it in a string, then turn it in a number
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
})

// get the type of EnvSchema
// other module can import this type
export type env = z.infer<typeof EnvSchema>

// eslint-disable-next-line import/no-mutable-exports, ts/no-redeclare
let env: env

try {
  // this is the only place where process.env is used in the app
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env)
}
catch (e) {
  const error = e as z.ZodError
  console.error('❌ Invalid environment variables ❌')
  // error.flatten().fieldErrors, zod error format
  console.error(error.flatten().fieldErrors)
  process.exit(1)
}

export default env
// if any of the env variables is missing, the app will exit with a code 1
// if one variable is missing, it will show: eg: { NODE_ENV: ['Required'] }
