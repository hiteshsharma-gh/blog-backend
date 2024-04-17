import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { verify } from "hono/jwt"
import { getBlogByIdSchema, postSchema, updatePostSchema } from "../zod/zod"
import { addBlog, findPostById, getAllPosts, updateBlog } from "../controllers/blogController"

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

app.get('/:blogId', zValidator("param", getBlogByIdSchema, (result: any, c) => {
  if (!result.success) {
    c.status(403)
    return c.json({
      error: "invalid blogId input"
    })
  }

  return result.data
}), async (c) => {
  try {
    const blogId = c.req.valid("param")

    const blog = await findPostById(c, blogId)
    console.log("Here")

    return c.json({
      message: "post found",
      blog
    })
  } catch (err) {
    c.status(403)
    return c.json({
      error: err
    })
  }
})

app.get('/bulk', async (c) => {
  try {
    const posts = await getAllPosts(c)

    return c.json({
      message: "posts found",
      posts
    })
  } catch (err) {
    c.status(403)
    return c.json({
      error: err
    })
  }
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
  try {
    const { title, content } = c.req.valid('json')
    const userId = c.get("userId")

    const blog = await addBlog(c, title, content, userId)

    return c.json({
      message: "post created successfully",
      id: blog.id
    })
  } catch (err) {
    c.status(403)
    return c.json({
      error: err
    })
  }
})

app.put('/', zValidator("json", updatePostSchema, (result: any, c) => {
  if (!result.success) {
    c.status(403)
    return c.json({
      error: "invalid updaote post inputs"
    })
  }

  return result.data
}), async (c) => {
  try {
    const { id, title, content } = c.req.valid('json')
    const userId = c.get("userId")

    const updatedPost = await updateBlog(c, id, userId, title, content)

    return c.json({
      message: "post updated successfully",
      id: updatedPost.id
    })
  } catch (err) {
    c.status(403)
    return c.json({
      error: err
    })
  }
})

export default app
