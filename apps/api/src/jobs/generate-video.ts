// BullMQ job processor for generate-video
import { Job } from 'bullmq'

export async function processGenerateVideo(job: Job) {
  // TODO: Implement generate-video processor
  console.log(`Processing generate-video with data:`, job.data)
}
