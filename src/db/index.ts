import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Context } from 'hono';

export function PrismaClientGenerator(c: Context) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL
  }).$extends(withAccelerate());

  return prisma;
}
