import { Hono } from "hono";

const app = new Hono()

app.post('/signup', (c) => {
  return c.json({
    page: "user/signup",
    method: "post"
  })
})

app.post('/signin', (c) => {
  return c.json({
    page: "user/signin",
    method: "post"
  })
})

export default app
