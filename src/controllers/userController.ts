import { Context } from "hono"
import { PrismaClientGenerator } from "../db"

export async function hashGenerator(password: string) {
  const Password = new TextEncoder().encode(password)

  const digest = await crypto.subtle.digest({
    name: 'SHA-256'
  }, Password)

  const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')

  return hash
}

export async function findUserByEmail(c: Context, email: string) {
  const prisma = PrismaClientGenerator(c)

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (user) {
    return user
  } else {
    return false
  }
}

export async function addUser(c: Context, username: string, email: string, password: string) {
  const hash = await hashGenerator(password)

  const userData = { username, email, password: hash }

  const prisma = PrismaClientGenerator(c)

  const User = await prisma.user.create({
    data: userData,
  })

  return User
}
