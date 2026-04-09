// evaluation job processor
import { Job } from 'bullmq'

export async function processEvaluation(job: Job) {
  // TODO: Implement evaluation processor logic
  console.log(`Processing evaluation job:`, job.id, job.data)
}
