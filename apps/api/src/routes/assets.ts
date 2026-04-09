// assets routes
import { FastifyInstance } from 'fastify'

export async function registerAssetsRoutes(fastify: FastifyInstance) {
  // TODO: Implement assets routes
  fastify.get('/assets', async (request, reply) => {
    return { message: 'assets routes placeholder' }
  })
}
