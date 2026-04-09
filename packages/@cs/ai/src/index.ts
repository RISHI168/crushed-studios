/**
 * @cs/ai - AI Provider, Training, and Evaluation
 * Central export point for all AI system modules
 */

// Provider interfaces
export { AIProvider, type GenerateOptions, type HealthStatus, type Capability } from './providers/interface';
export { FalProvider } from './providers/fal';
export { ReplicateProvider } from './providers/replicate';
export { ElevenLabsProvider } from './providers/elevenlabs';
export { AnthropicProvider } from './providers/anthropic';
export { MockProvider } from './providers/mock';

// Self-hosted providers
export { VLLMAdapter } from './providers/self-hosted/vllm-adapter';
export { ComfyUIAdapter } from './providers/self-hosted/comfyui-adapter';
export { DiffusersAdapter } from './providers/self-hosted/diffusers-adapter';
export { AudioServerAdapter } from './providers/self-hosted/audio-server-adapter';
export { EmbeddingAdapter } from './providers/self-hosted/embedding-adapter';
export { ModelCache, type ModelConfig, type LoRAConfig } from './providers/self-hosted/model-loader';

// Health and GPU management
export { checkGPUHealth, checkSystemHealth, monitorHealth } from './providers/self-hosted/health-check';
export { GPUPool, type GPUAllocation } from './providers/self-hosted/gpu-pool';

// Core orchestration
export { routeRequest, getAvailableProviders, selectProvider } from './router';
export { AGENT_PROVIDER_MAP, getAgentProvider, getAgentsForProvider } from './agent-map';
export { initializeQueue, queueGenerationJob, setupQueueProcessor, type GenerationJob } from './queue';
export { calculateCost, trackCost, getTotalProjectCost, getCostBreakdown, type CostRecord } from './cost-tracker';
export {
  getHostingStrategy,
  shouldMigrateToSelfHosted,
  estimateSavings,
  type HostingMode,
  type HostingConfig,
} from './hosting-strategy';

// Training
export { startLoRATraining, monitorLoRATraining, cancelLoRATraining, type LoRATrainingConfig } from './training/lora-trainer';
export { startDPOTraining, prepareDPOData, evaluateDPOModel, type DPOConfig } from './training/dpo-pipeline';
export { startRLHFTraining, RLHFPhases } from './training/rlhf-orchestrator';
export { trainRewardModel, scoreWithRewardModel, evaluateRewardModel, type RewardModelConfig } from './training/reward-model';
export { ModelRegistry, type ModelVersionEntry } from './training/model-registry';
export { shouldTriggerTraining, calculateNextTrainTime, scheduleTrainings } from './training/training-scheduler';

// Data Flywheel
export { collectPreference, batchCollectPreferences, autoPairFeedback, type RawFeedback } from './data-flywheel/preference-collector';
export { formatForDPO, formatForSFT, formatForRanking, augmentDataset, type FormattedPair } from './data-flywheel/pair-formatter';
export { extractCorrections, correctionsToTrainingData, identifyPatterns, type Correction } from './data-flywheel/correction-extractor';
export { storeDataset, loadDataset, getDatasetStats, mergeDatasets, type DatasetStats } from './data-flywheel/dataset-store';
export { validatePair, filterByQuality, removeDuplicates, cleanDataset, type QualityMetrics } from './data-flywheel/quality-filter';
export { anonymizePair, anonymizeDataset, hashPII, createAuditTrail } from './data-flywheel/anonymizer';
export {
  calculateVelocity,
  calculateQualityScore,
  calculateDiversityScore,
  calculateTrainingReadiness,
  getFlyWheelMetrics,
  type FlyWheelMetrics,
} from './data-flywheel/metrics';
export { exportToJSONL, exportToJSON, exportToCSV, exportDataset, type ExportFormat } from './data-flywheel/export';

// Evaluation
export { runBenchmark, runBenchmarkSuite, compareModels, type BenchmarkResult } from './evaluation/benchmark-runner';
export { scoreOutput, batchScoreOutputs, calculateAverageQuality, type QualityScore } from './evaluation/quality-scorer';
export { compareOutputs, rankOutputs } from './evaluation/reward-scorer';
export { checkRegression, approveRegression, analyzeRegressions, type RegressionReport } from './evaluation/regression-checker';
export { runABTest, calculateSignificance, ABTestTracker, type ABTestResult } from './evaluation/ab-comparator';
export {
  checkPromotionGate,
  promoteModel,
  DEFAULT_PROMOTION_GATES,
  type PromotionGate,
  type PromotionDecision,
} from './evaluation/promotion-gate';
