// projects routes
import { FastifyInstance } from 'fastify'

export async function registerProjectsRoutes(fastify: FastifyInstance) {
  // TODO: Implement projects routes
  fastify.get('/projects', async (request, reply) => {
    return { message: 'projects routes placeholder' }
  })
}
