// scenes routes
import { FastifyInstance } from 'fastify'

export async function registerScenesRoutes(fastify: FastifyInstance) {
  // TODO: Implement scenes routes
  fastify.get('/scenes', async (request, reply) => {
    return { message: 'scenes routes placeholder' }
  })
}
