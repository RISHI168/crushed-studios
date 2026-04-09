/**
 * Mock Provider Adapter
 * Simulated responses for testing and development
 */

import { AIProvider, type GenerateOptions, type HealthStatus, type Capability } from './interface';

export class MockProvider extends AIProvider {
  id = 'mock';
  private delay: number;

  constructor(delay: number = 1000) {
    super();
    this.delay = delay;
  }

  /**
   * Generate mock response with simulated delay
   */
  async generate(prompt: string, options?: GenerateOptions): Promise<string> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    return `Mock response to: ${prompt.substring(0, 50)}...`;
  }

  /**
   * Get mock capabilities
   */
  async capabilities(): Promise<Capability[]> {
    return [
      {
        id: 'mock_text',
        name: 'Mock Text Generation',
        modalities: ['text'],
      },
      {
        id: 'mock_video',
        name: 'Mock Video Generation',
        modalities: ['text', 'image'],
        maxDuration: 60,
      },
    ];
  }

  /**
   * Check mock provider health (always healthy)
   */
  async health(): Promise<HealthStatus> {
    const start = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 10));
    const latency = Date.now() - start;

    return {
      healthy: true,
      latency,
      timestamp: new Date().toISOString(),
    };
  }
}
