// generations routes
import { FastifyInstance } from 'fastify'

export async function registerGenerationsRoutes(fastify: FastifyInstance) {
  // TODO: Implement generations routes
  fastify.get('/generations', async (request, reply) => {
    return { message: 'generations routes placeholder' }
  })
}
