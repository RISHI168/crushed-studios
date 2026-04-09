// auth routes
import { FastifyInstance } from 'fastify'

export async function registerAuthRoutes(fastify: FastifyInstance) {
  // TODO: Implement auth routes
  fastify.get('/auth', async (request, reply) => {
    return { message: 'auth routes placeholder' }
  })
}
