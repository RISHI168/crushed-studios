/**
 * Progressive Self-Hosting Strategy
 * Gradually migrate from serverless to self-hosted infrastructure
 */

export type HostingMode = 'serverless' | 'hybrid' | 'self-hosted';

export interface HostingConfig {
  mode: HostingMode;
  serverlessThreshold: number; // Operations per day before switching
  autoScaleTrigger: number; // Cost threshold
  gpuCount: number;
  preferredProviders: string[];
}

/**
 * Get current hosting strategy
 */
export function getHostingStrategy(): HostingConfig {
  const mode = (process.env.PROVIDER_MODE as HostingMode) || 'serverless';

  return {
    mode,
    serverlessThreshold: 1000,
    autoScaleTrigger: 5000,
    gpuCount: 1,
    preferredProviders: getPreferredProviders(mode),
  };
}

/**
 * Get preferred providers for current hosting mode
 */
function getPreferredProviders(mode: HostingMode): string[] {
  switch (mode) {
    case 'serverless':
      return ['fal', 'replicate', 'anthropic', 'elevenlabs'];
    case 'hybrid':
      return ['vllm', 'comfyui', 'fal', 'replicate'];
    case 'self-hosted':
      return ['vllm', 'comfyui', 'diffusers', 'audio_server'];
    default:
      return ['mock'];
  }
}

/**
 * Determine if should switch hosting mode based on metrics
 */
export function shouldMigrateToSelfHosted(
  operationsPerDay: number,
  monthlySpend: number,
): boolean {
  const config = getHostingStrategy();

  // Migrate if operations exceed threshold and spend is high
  return operationsPerDay > config.serverlessThreshold && monthlySpend > config.autoScaleTrigger;
}

/**
 * Estimate cost savings with self-hosting
 */
export function estimateSavings(
  monthlyServerlessCost: number,
  gpuCount: number = 1,
): { monthlyGpuCost: number; yearlySavings: number } {
  // Estimate based on GPU rental costs
  const monthlyGpuCost = gpuCount * 1000; // Placeholder

  const yearlySavings = (monthlyServerlessCost - monthlyGpuCost) * 12;

  return { monthlyGpuCost, yearlySavings };
}
