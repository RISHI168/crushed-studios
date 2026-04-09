/**
 * Credit Tracking and Cost Calculation
 * Manages credit usage for generation operations
 */

import { CREDIT_COSTS } from '@cs/constants';

export interface CreditTransaction {
  type: keyof typeof CREDIT_COSTS;
  amount: number;
  timestamp: string;
  reference: string;
}

/**
 * Calculate the credit cost for a generation operation
 *
 * @param type - Operation type (video, storyboard, audio, regeneration)
 * @param quantity - Number of items (scenes, panels, tracks)
 * @returns Total credits required
 */
export function calculateCost(
  type: keyof typeof CREDIT_COSTS,
  quantity: number = 1,
): number {
  const baseCost = CREDIT_COSTS[type] || 0;
  return baseCost * quantity;
}

/**
 * Check if user has sufficient credits for an operation
 *
 * @param currentBalance - User's current credit balance
 * @param requiredCredits - Credits required for operation
 * @returns Whether operation can proceed
 */
export function checkBalance(currentBalance: number, requiredCredits: number): boolean {
  return currentBalance >= requiredCredits;
}

/**
 * Deduct credits from balance and record transaction
 *
 * @param currentBalance - Current credit balance
 * @param type - Operation type
 * @param quantity - Quantity of items
 * @returns New balance and transaction record
 */
export function deductCredits(
  currentBalance: number,
  type: keyof typeof CREDIT_COSTS,
  quantity: number = 1,
): { newBalance: number; transaction: CreditTransaction } {
  const cost = calculateCost(type, quantity);

  return {
    newBalance: currentBalance - cost,
    transaction: {
      type,
      amount: cost,
      timestamp: new Date().toISOString(),
      reference: `${type}_${Date.now()}`,
    },
  };
}

/**
 * Refund credits for failed or rejected operations
 *
 * @param currentBalance - Current credit balance
 * @param refundAmount - Credits to refund
 * @returns New balance and refund transaction
 */
export function refundCredits(
  currentBalance: number,
  refundAmount: number,
): { newBalance: number; transaction: CreditTransaction } {
  return {
    newBalance: currentBalance + refundAmount,
    transaction: {
      type: 'video', // Generic type for refunds
      amount: -refundAmount,
      timestamp: new Date().toISOString(),
      reference: `refund_${Date.now()}`,
    },
  };
}
