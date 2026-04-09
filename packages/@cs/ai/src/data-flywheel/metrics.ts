/**
 * Data Flywheel Metrics
 * Tracks metrics of preference collection and dataset quality
 */

export interface FlyWheelMetrics {
  pairsCollected: number;
  pairsPerDay: number;
  qualityScore: number;
  diversityScore: number;
  trainingEligibility: number;
  lastUpdated: string;
}

/**
 * Calculate collection velocity
 */
export function calculateVelocity(
  pairsCollected: number,
  daysElapsed: number,
): number {
  return daysElapsed > 0 ? pairsCollected / daysElapsed : 0;
}

/**
 * Calculate dataset quality score
 */
export function calculateQualityScore(
  validPairs: number,
  totalPairs: number,
  averageScore: number,
): number {
  const validityRatio = totalPairs > 0 ? validPairs / totalPairs : 0;
  return (validityRatio * 0.7 + averageScore * 0.3) * 100;
}

/**
 * Calculate dataset diversity score
 */
export function calculateDiversityScore(
  uniquePrompts: number,
  uniqueOutputs: number,
  totalPairs: number,
): number {
  const promptDiversity = uniquePrompts / Math.max(totalPairs, 1);
  const outputDiversity = uniqueOutputs / Math.max(totalPairs * 2, 1);
  return ((promptDiversity + outputDiversity) / 2) * 100;
}

/**
 * Calculate training readiness
 */
export function calculateTrainingReadiness(
  qualityScore: number,
  pairsCollected: number,
  minimumPairs: number = 100,
): number {
  const pairsFraction = Math.min(pairsCollected / minimumPairs, 1);
  const qualityFraction = qualityScore / 100;
  return (pairsFraction * 0.6 + qualityFraction * 0.4) * 100;
}

/**
 * Get complete flywheel metrics
 */
export function getFlyWheelMetrics(
  pairsCollected: number,
  validPairs: number,
  uniquePrompts: number,
  uniqueOutputs: number,
  daysElapsed: number,
): FlyWheelMetrics {
  const velocity = calculateVelocity(pairsCollected, daysElapsed);
  const quality = calculateQualityScore(validPairs, pairsCollected, 0.8);
  const diversity = calculateDiversityScore(uniquePrompts, uniqueOutputs, pairsCollected);
  const training = calculateTrainingReadiness(quality, pairsCollected);

  return {
    pairsCollected,
    pairsPerDay: velocity,
    qualityScore: quality,
    diversityScore: diversity,
    trainingEligibility: training,
    lastUpdated: new Date().toISOString(),
  };
}
