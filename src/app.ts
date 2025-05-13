import configureOpenAPI from '@/lib/config-open-api'
import createApp from '@/lib/create-app'
import index from '@/lib/routes/index.route'

const app = createApp()

const routes = [
  index
]

configureOpenAPI(app)

routes.forEach((route) => {
  app.route('/', route)
})

export default app
