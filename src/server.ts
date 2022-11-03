import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  log: ['query']
})


//? Boostrap is equal to our main function
async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true
  })

  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  })

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count()
    return { count }
  })

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()
    return {  count }
  })

  fastify.post('/pools', async (request, reply) => {
    //? lib for schema validation
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)
    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code
      }
    })


    return reply.status(201).send({ code })
  })


  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

//? The TSX dependency is responsible for autoreload and compile our TS for JS

bootstrap()

//? Tooling for diagram creation with code:
//? Mermaid-js
//? Prisma-erd-generator uses on low level the Mermaid-js