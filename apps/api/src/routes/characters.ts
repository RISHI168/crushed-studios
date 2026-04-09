// characters routes
import { FastifyInstance } from 'fastify'

export async function registerCharactersRoutes(fastify: FastifyInstance) {
  // TODO: Implement characters routes
  fastify.get('/characters', async (request, reply) => {
    return { message: 'characters routes placeholder' }
  })
}
