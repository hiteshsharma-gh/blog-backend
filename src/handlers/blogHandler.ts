import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { verify } from "hono/jwt"
import { postSchema } from "../zod/zod"

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }
}>()

app.use('/*', async (c, next) => {
  const jwt = c.req.header("Authorization")
  if (!jwt) {
    c.status(401)
    return c.json({
      error: "jwt not found"
    })
  }

  const payload = await verify(jwt, c.env.JWT_SECRET)
  if (!payload) {
    c.status(401)
    return c.json({
      error: "unauthorized"
    })
  }

  c.set("userId", payload.id)

  await next()
})

app.get('/:blogId', (c) => {
  const pageId = c.req.param('blogId')
  return c.json({
    page: "blog",
    pageId,
    method: "get"
  })
})

app.post('/', zValidator('json', postSchema, (result: any, c) => {
  if (!result.success) {
    c.status(403)
    return c.json({
      error: "invalid post inputs"
    })
  }

  return result.data
}), async (c) => {
  const { title, content } = c.req.valid('json')

})

app.put('/', (c) => {
  return c.json({
    page: "blog",
    method: "put"
  })
})

export default app
