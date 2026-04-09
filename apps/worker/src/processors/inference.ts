// inference job processor
import { Job } from 'bullmq'

export async function processInference(job: Job) {
  // TODO: Implement inference processor logic
  console.log(`Processing inference job:`, job.id, job.data)
}
