// admin routes
import { FastifyInstance } from 'fastify'

export async function registerAdminRoutes(fastify: FastifyInstance) {
  // TODO: Implement admin routes
  fastify.get('/admin', async (request, reply) => {
    return { message: 'admin routes placeholder' }
  })
}
