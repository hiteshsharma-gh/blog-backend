import { Hono } from 'hono'

const app = new Hono()

app.get('/api/v1/blog/:blogId', (c) => {
  const pageId = c.req.param('blogId')
  return c.json({
    page: "blog",
    pageId,
    method: "get"
  })
})

app.post('/api/v1/user/signup', (c) => {
  return c.json({
    page: "user/signup",
    method: "post"
  })
})

app.post('/api/v1/user/signin', (c) => {
  return c.json({
    page: "user/signin",
    method: "post"
  })
})

app.post('/api/v1/blog', (c) => {
  return c.json({
    page: "blog",
    method: "post"
  })
})

app.put('/api/v1/blog', (c) => {
  return c.json({
    page: "blog",
    method: "put"
  })
})

export default app
