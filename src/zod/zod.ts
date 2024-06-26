import { z } from "zod"

export const singupSchema = z.object({
  username: z.string().max(20),
  email: z.string().email(),
  password: z.string().min(6)
})

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const postSchema = z.object({
  title: z.string(),
  content: z.string()
})

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional()
})

export const getBlogByIdSchema = z.string()
