/**
 * Agent to Provider Mapping
 * Maps 7 agents to their respective AI providers
 */

import type { AgentId } from '@cs/constants';
import { AGENT_ROSTER } from '@cs/constants';

export interface AgentProviderMap {
  agentId: AgentId;
  provider: string;
  model: string;
  capabilities: string[];
}

/**
 * Map each agent to its provider
 */
export const AGENT_PROVIDER_MAP: Record<AgentId, AgentProviderMap> = {
  scriptwriter: {
    agentId: 'scriptwriter',
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    capabilities: ['text-analysis', 'structure-extraction'],
  },
  continuity: {
    agentId: 'continuity',
    provider: 'anthropic',
    model: 'claude-3-opus',
    capabilities: ['graph-analysis', 'constraint-validation'],
  },
  cinematography: {
    agentId: 'cinematography',
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    capabilities: ['configuration-resolution', 'constraint-application'],
  },
  storyboard: {
    agentId: 'storyboard',
    provider: 'replicate',
    model: 'stable-diffusion-3',
    capabilities: ['image-generation', 'visual-guidance'],
  },
  prompt: {
    agentId: 'prompt',
    provider: 'anthropic',
    model: 'claude-3-haiku',
    capabilities: ['text-merging', 'prompt-optimization'],
  },
  generation: {
    agentId: 'generation',
    provider: 'fal',
    model: 'video-generation-model',
    capabilities: ['video-generation', 'high-quality-output'],
  },
  validation: {
    agentId: 'validation',
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    capabilities: ['output-analysis', 'quality-checking'],
  },
};

/**
 * Get provider for an agent
 */
export function getAgentProvider(agentId: AgentId): AgentProviderMap {
  return AGENT_PROVIDER_MAP[agentId];
}

/**
 * Get all agents for a provider
 */
export function getAgentsForProvider(provider: string): AgentId[] {
  return Object.entries(AGENT_PROVIDER_MAP)
    .filter(([, config]) => config.provider === provider)
    .map(([agentId]) => agentId as AgentId);
}
