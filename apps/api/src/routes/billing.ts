// billing routes
import { FastifyInstance } from 'fastify'

export async function registerBillingRoutes(fastify: FastifyInstance) {
  // TODO: Implement billing routes
  fastify.get('/billing', async (request, reply) => {
    return { message: 'billing routes placeholder' }
  })
}
