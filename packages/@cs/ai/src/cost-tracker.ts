/**
 * Cost Tracking and Credit Management
 * Tracks credits used for each request
 */

import { CREDIT_COSTS } from '@cs/constants';

export interface CostRecord {
  requestId: string;
  userId: string;
  projectId: string;
  operation: keyof typeof CREDIT_COSTS;
  creditsUsed: number;
  timestamp: string;
}

/**
 * Calculate cost for a generation request
 */
export function calculateCost(
  operation: keyof typeof CREDIT_COSTS,
  quantity: number = 1,
): number {
  const baseCost = CREDIT_COSTS[operation] || 0;
  return baseCost * quantity;
}

/**
 * Track cost for a request
 */
export function trackCost(
  requestId: string,
  userId: string,
  projectId: string,
  operation: keyof typeof CREDIT_COSTS,
  quantity: number = 1,
): CostRecord {
  return {
    requestId,
    userId,
    projectId,
    operation,
    creditsUsed: calculateCost(operation, quantity),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get total cost for a project
 */
export function getTotalProjectCost(
  records: CostRecord[],
  projectId: string,
): number {
  return records
    .filter((r) => r.projectId === projectId)
    .reduce((sum, r) => sum + r.creditsUsed, 0);
}

/**
 * Get cost breakdown by operation
 */
export function getCostBreakdown(
  records: CostRecord[],
  projectId: string,
): Record<string, number> {
  const breakdown: Record<string, number> = {};

  records
    .filter((r) => r.projectId === projectId)
    .forEach((r) => {
      breakdown[r.operation] = (breakdown[r.operation] || 0) + r.creditsUsed;
    });

  return breakdown;
}
