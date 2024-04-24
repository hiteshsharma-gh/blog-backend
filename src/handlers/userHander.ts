import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { signinSchema, singupSchema } from "../zod/zod";
import { addUser, findUserByEmail, hashGenerator } from "../controllers/userController";
import { sign } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

app.post('/signup', zValidator("json", singupSchema, (result: any, c) => {
  if (!result.success) {
    return c.json({
      message: "invalid singup input"
    })
  }

  return result.data
}), async (c) => {
  const { username, email, password } = c.req.valid("json")

  const userExists = await findUserByEmail(c, email)
  if (userExists) {
    return c.json({
      message: "user already exists"
    })
  }

  const User = await addUser(c, username, email, password)

  const token = await sign(User.id, c.env?.JWT_SECRET);

  return c.json({
    message: "user created successfully",
    User,
    token
  })
})

app.post('/signin', zValidator("json", signinSchema, (result: any, c) => {
  if (!result.success) {
    return c.json({
      message: "invalid singin input"
    })
  }

  return result.data
}), async (c) => {
  const { email, password } = c.req.valid("json")

  const User = await findUserByEmail(c, email)

  if (!User) {
    return c.json({
      message: "User doesn't exist"
    })
  }

  const hash = await hashGenerator(password)

  if (hash != User.password) {
    return c.json({
      message: "invalid password"
    })
  }

  const token = await sign(User.id, c.env?.JWT_SECRET)

  return c.json({
    message: "login successfull",
    User,
    token
  })
})

export default app
