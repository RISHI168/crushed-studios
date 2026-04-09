// training routes
import { FastifyInstance } from 'fastify'

export async function registerTrainingRoutes(fastify: FastifyInstance) {
  // TODO: Implement training routes
  fastify.get('/training', async (request, reply) => {
    return { message: 'training routes placeholder' }
  })
}
