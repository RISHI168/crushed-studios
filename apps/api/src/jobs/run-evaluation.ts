// BullMQ job processor for run-evaluation
import { Job } from 'bullmq'

export async function processRunEvaluation(job: Job) {
  // TODO: Implement run-evaluation processor
  console.log(`Processing run-evaluation with data:`, job.data)
}
