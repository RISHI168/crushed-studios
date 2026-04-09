// BullMQ worker process for GPU-intensive workloads
import { Worker } from 'bullmq'
import pino from 'pino'
import { processInference } from './processors/inference.js'
import { processTraining } from './processors/training.js'
import { processEvaluation } from './processors/evaluation.js'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

const redisConnection = {
  host: new URL(process.env.REDIS_URL || 'redis://localhost:6379').hostname,
  port: parseInt(new URL(process.env.REDIS_URL || 'redis://localhost:6379').port || '6379'),
}

// Create workers for different job types
const inferenceWorker = new Worker('inference', processInference, {
  connection: redisConnection,
  concurrency: 1, // GPU workloads don't parallelize well
})

const trainingWorker = new Worker('training', processTraining, {
  connection: redisConnection,
  concurrency: 1,
})

const evaluationWorker = new Worker('evaluation', processEvaluation, {
  connection: redisConnection,
  concurrency: 2,
})

// Event handlers
inferenceWorker.on('completed', (job) => {
  logger.info(`Inference job ${job.id} completed`)
})

inferenceWorker.on('failed', (job, err) => {
  logger.error(`Inference job ${job?.id} failed: ${err.message}`)
})

trainingWorker.on('completed', (job) => {
  logger.info(`Training job ${job.id} completed`)
})

trainingWorker.on('failed', (job, err) => {
  logger.error(`Training job ${job?.id} failed: ${err.message}`)
})

evaluationWorker.on('completed', (job) => {
  logger.info(`Evaluation job ${job.id} completed`)
})

evaluationWorker.on('failed', (job, err) => {
  logger.error(`Evaluation job ${job?.id} failed: ${err.message}`)
})

logger.info('Worker process started')

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down')
  await inferenceWorker.close()
  await trainingWorker.close()
  await evaluationWorker.close()
  process.exit(0)
})
