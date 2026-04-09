/**
 * Abstract AI Provider Interface
 * Defines contract for all AI provider adapters
 */

export interface GenerateOptions {
  quality?: 'draft' | 'standard' | 'high' | 'cinema';
  timeout?: number;
  webhook?: string;
  metadata?: Record<string, unknown>;
}

export interface HealthStatus {
  healthy: boolean;
  latency?: number;
  error?: string;
  timestamp: string;
}

export interface Capability {
  id: string;
  name: string;
  modalities: string[];
  maxDuration?: number;
  costPerRequest?: number;
}

/**
 * Abstract base class for AI providers
 */
export abstract class AIProvider {
  /**
   * Provider ID (e.g., 'fal', 'replicate', 'anthropic')
   */
  abstract id: string;

  /**
   * Generate output from prompt/input
   * @param input Input prompt or data
   * @param options Generation options
   * @returns Generated output
   */
  abstract generate(input: string, options?: GenerateOptions): Promise<string>;

  /**
   * Get provider capabilities
   * @returns List of supported capabilities
   */
  abstract capabilities(): Promise<Capability[]>;

  /**
   * Check provider health and availability
   * @returns Health status
   */
  abstract health(): Promise<HealthStatus>;
}
