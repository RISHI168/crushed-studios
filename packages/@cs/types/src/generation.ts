/**
 * Generation Request/Response Types
 */

import type { PromptLayerId, AgentId } from '@cs/constants';

export interface PromptLayer {
  id: PromptLayerId;
  content: string;
  weight?: number;
}

export interface GenerateRequest {
  sceneId: string;
  projectId: string;
  promptLayers: PromptLayer[];
  options?: {
    oversampling?: number;
    quality?: 'draft' | 'standard' | 'high' | 'cinema';
    provider?: string;
  };
}

export interface AgentFeedItem {
  agentId: AgentId;
  timestamp: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  output?: string;
  error?: string;
}

export interface GenerateResult {
  id: string;
  sceneId: string;
  projectId: string;
  status: 'pending' | 'generating' | 'complete' | 'failed' | 'rejected';
  videoUrl?: string;
  thumbnailUrl?: string;
  agentLog: AgentFeedItem[];
  credits: number;
  duration: number;
  createdAt: string;
  completedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface GenerationJob {
  id: string;
  sceneId: string;
  projectId: string;
  userId: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  result?: GenerateResult;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}
