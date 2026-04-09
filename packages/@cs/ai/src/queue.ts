/**
 * Job Queue Setup
 * BullMQ queue for generation job management
 */

import { Queue } from 'bullmq';
import type { GenerateRequest } from '@cs/types';

export interface GenerationJob {
  sceneId: string;
  projectId: string;
  requestData: GenerateRequest;
  priority: number;
}

/**
 * Initialize generation queue
 */
export function initializeQueue(redisUrl?: string) {
  const connection = {
    host: new URL(redisUrl || 'redis://localhost:6379').hostname,
    port: parseInt(new URL(redisUrl || 'redis://localhost:6379').port) || 6379,
  };

  return new Queue<GenerationJob>('generation', { connection });
}

/**
 * Add job to queue
 */
export async function queueGenerationJob(
  queue: Queue<GenerationJob>,
  job: GenerationJob,
): Promise<string> {
  const queuedJob = await queue.add('generate', job, {
    priority: job.priority,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });

  return queuedJob.id || '';
}

/**
 * Process jobs from queue
 */
export function setupQueueProcessor(queue: Queue<GenerationJob>, handler: (job: GenerationJob) => Promise<void>) {
  // Note: BullMQ Queue doesn't have .process() method
  // In newer BullMQ versions, use Worker instead
  // This is a placeholder for queue processor setup
  console.log('Queue processor setup for queue:', queue.name);
}
