/**
 * Tests for Mock Provider
 */

import { describe, it, expect } from 'vitest';
import { MockProvider } from '../src/providers/mock';

describe('Mock Provider', () => {
  it('should generate mock response', async () => {
    const provider = new MockProvider(10);
    const result = await provider.generate('test prompt');
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return capabilities', async () => {
    const provider = new MockProvider();
    const capabilities = await provider.capabilities();
    expect(capabilities).toBeDefined();
    expect(capabilities.length).toBeGreaterThan(0);
  });

  it('should report healthy status', async () => {
    const provider = new MockProvider();
    const health = await provider.health();
    expect(health.healthy).toBe(true);
  });

  it('should have latency in health check', async () => {
    const provider = new MockProvider();
    const health = await provider.health();
    expect(health.latency).toBeDefined();
    expect(health.latency).toBeGreaterThan(0);
  });
});
