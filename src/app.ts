import configureOpenAPI from '@/lib/config-open-api'
import createApp from '@/lib/create-app'
import index from '@/lib/routes/index.route'
import tasks from '@/lib/routes/tasks/tasks.index'
const app = createApp()

const routes = [
  index, 
  tasks
]

configureOpenAPI(app)

// mount the routes on the app
routes.forEach((route) => {
  app.route('/', route)
})

export default app
