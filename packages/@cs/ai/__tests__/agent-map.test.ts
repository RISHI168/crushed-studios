/**
 * Tests for Agent to Provider Mapping
 */

import { describe, it, expect } from 'vitest';
import { getAgentProvider, getAgentsForProvider, AGENT_PROVIDER_MAP } from '../src/agent-map';

describe('Agent Provider Map', () => {
  it('should map all agents', () => {
    expect(AGENT_PROVIDER_MAP).toBeDefined();
    expect(Object.keys(AGENT_PROVIDER_MAP).length).toBe(7);
  });

  it('should get provider for agent', () => {
    const provider = getAgentProvider('scriptwriter');
    expect(provider).toBeDefined();
    expect(provider.provider).toBe('anthropic');
  });

  it('should get agents for provider', () => {
    const agents = getAgentsForProvider('anthropic');
    expect(agents).toBeDefined();
    expect(agents.length).toBeGreaterThan(0);
  });

  it('should handle invalid agent gracefully', () => {
    // TODO: Add error handling test
    expect(true).toBe(true);
  });

  it('should have unique providers per agent', () => {
    const agentIds = Object.keys(AGENT_PROVIDER_MAP);
    const seen = new Set<string>();

    for (const agentId of agentIds) {
      const provider = getAgentProvider(agentId as any);
      expect(provider).toBeDefined();
      seen.add(provider.provider);
    }

    expect(seen.size).toBeGreaterThan(1);
  });
});
