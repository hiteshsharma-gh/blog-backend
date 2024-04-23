import { Hono } from 'hono'
import userHandler from './handlers/userHander'
import blogHandler from './handlers/blogHandler'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

app.route('/api/v1/user', userHandler)
app.route('/api/v1/blog', blogHandler)

export default app
