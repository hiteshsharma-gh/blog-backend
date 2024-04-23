import { Context } from "hono"
import { PrismaClientGenerator } from "../db"

export async function addUser(c: Context, email: string, password: string, name: string) {
  const Password = new TextEncoder().encode(password)

  const digest = await crypto.subtle.digest({
    name: 'SHA-256'
  }, Password)

  const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')

  const userData = { name, email, password: hash }

  const prisma = PrismaClientGenerator(c)

  const User = await prisma.user.create({
    data: userData
  })

  return User
}
