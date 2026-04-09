/**
 * ML Training and Model Management Types
 */

export interface PreferencePair {
  id: string;
  promptId: string;
  preferredOutputId: string;
  rejectedOutputId: string;
  feedback: string;
  score?: number;
  createdAt: string;
}

export interface TrainingDataset {
  id: string;
  name: string;
  description: string;
  agentId: string;
  pairsCount: number;
  quality: 'raw' | 'filtered' | 'validated';
  createdAt: string;
  updatedAt: string;
}

export interface TrainingRun {
  id: string;
  modelVersionId: string;
  datasetId: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  config: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
  metrics?: Record<string, number>;
}

export interface ModelVersion {
  id: string;
  agentId: string;
  version: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  trainedAt?: string;
}

export interface EvalResult {
  id: string;
  modelVersionId: string;
  benchmark: string;
  score: number;
  details?: Record<string, unknown>;
  createdAt: string;
}
