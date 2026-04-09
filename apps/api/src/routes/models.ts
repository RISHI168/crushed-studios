// models routes
import { FastifyInstance } from 'fastify'

export async function registerModelsRoutes(fastify: FastifyInstance) {
  // TODO: Implement models routes
  fastify.get('/models', async (request, reply) => {
    return { message: 'models routes placeholder' }
  })
}
