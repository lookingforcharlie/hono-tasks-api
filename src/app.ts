import configureOpenAPI from '@/lib/config-open-api'
import createApp from '@/lib/create-app'
import index from '@/routes/index.route'
import tasks from '@/routes/tasks/tasks.index'

const app = createApp()

// As the application grows, we will add more and more routers
const routes = [
  index,
  tasks,
] as const // make routes readonly, not gonna change at runtime

configureOpenAPI(app)

// mount the routes on the app
routes.forEach((route) => {
  app.route('/', route)
})

// Get a typed client for the entire application, just like testClient in the test file
// a union type of all the routes, give me the type of everything in the routes array
// AppType has all the possible types of the routes within the application
// Now, we can pass this type into the hono client
export type AppType = typeof routes[number]

export default app
