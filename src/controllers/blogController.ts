import { Context } from "hono"
import { PrismaClientGenerator } from "../db"
import { Record } from "@prisma/client/runtime/library"

export async function addBlog(c: Context, title: string, content: string, authorId: string) {
  const prisma = PrismaClientGenerator(c)

  const blog = await prisma.post.create({
    data: {
      title,
      content,
      authorId
    }
  })

  return blog
}

export async function updateBlog(c: Context, id: string, authorId: string, title?: string, content?: string) {
  const prisma = PrismaClientGenerator(c)

  const updatedPost = await prisma.post.update({
    where: {
      id,
      authorId
    },
    data: {
      title,
      content
    }
  })

  return updatedPost
}

export async function findPostById(c: Context, id: string) {
  const prisma = PrismaClientGenerator(c)

  const post = await prisma.post.findUnique({
    where: {
      id
    }
  })
  if (!post) {
    return false
  }

  return post
}

export async function getAllPosts(c: Context) {
  const prisma = PrismaClientGenerator(c)

  const posts = await prisma.post.findMany()

  return posts
}
