// Example for Hono RPC feature: https://hono.dev/docs/guides/rpc
// this is frontend code, not server code
import { hc } from 'hono/client'

import type { AppType } from '@/app'

// client is fully typed, it knows all the routes and their parameters and responses
const client = hc<AppType>('http://localhost:9999/')

client.index.$get()

client.tasks.$get()
