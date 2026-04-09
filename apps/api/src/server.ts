// Fastify server setup with plugin registration
import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifyRateLimit from '@fastify/rate-limit'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

const fastify = Fastify({
  logger,
})

// Register plugins
await fastify.register(fastifyCors, {
  origin: true,
  credentials: true,
})

await fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Crushed Studios API',
      description: 'AI-powered video generation API',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development',
      },
    ],
  },
})

await fastify.register(fastifyWebsocket)

await fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '15 minutes',
})

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' }
})

// Register routes
// TODO: Register route plugins here

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: parseInt(process.env.PORT || '3001'), host: '0.0.0.0' })
    logger.info(`Server running at http://localhost:${process.env.PORT || 3001}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
