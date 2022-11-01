import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'

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

    return {  count }
  })


  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

//? The TSX dependency is responsible for autoreload and compile our TS for JS

bootstrap()

//? Tooling for diagram creation with code:
//? Mermaid-js
//? Prisma-erd-generator uses on low level the Mermaid-js