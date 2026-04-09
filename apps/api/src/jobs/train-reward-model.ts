// BullMQ job processor for train-reward-model
import { Job } from 'bullmq'

export async function processTrainRewardModel(job: Job) {
  // TODO: Implement train-reward-model processor
  console.log(`Processing train-reward-model with data:`, job.data)
}
