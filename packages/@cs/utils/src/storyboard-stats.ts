/**
 * Storyboard Statistics Utility
 * Tracks panel status, approval rates, and regeneration metrics
 */

import type { StoryboardPanel } from '@cs/types';

export interface StoryboardStats {
  totalPanels: number;
  approvedPanels: number;
  pendingPanels: number;
  regeneratingPanels: number;
  rejectedPanels: number;
  approvalRate: number;
  averagePanelsPerScene: number;
  lastUpdated: string;
}

/**
 * Calculate comprehensive storyboard statistics across scenes/panels
 *
 * @param panels - Array of storyboard panels
 * @returns Statistics object
 */
export function getStoryboardStats(panels: StoryboardPanel[]): StoryboardStats {
  // TODO: Implement full statistics calculation
  // 1. Count panels by status
  // 2. Calculate approval rate
  // 3. Track regeneration attempts
  // 4. Compute average panels per scene

  const totalPanels = panels.length;
  const approvedPanels = panels.filter((p) => p.approved).length;
  const regeneratingPanels = panels.filter((p) => p.regenerating).length;
  const rejectedPanels = panels.filter((p) => p.rejectionReason).length;
  const pendingPanels = totalPanels - approvedPanels - regeneratingPanels - rejectedPanels;

  return {
    totalPanels,
    approvedPanels,
    pendingPanels,
    regeneratingPanels,
    rejectedPanels,
    approvalRate: totalPanels > 0 ? approvedPanels / totalPanels : 0,
    averagePanelsPerScene: totalPanels > 0 ? totalPanels / (totalPanels / 10) : 0, // TODO: actual calc
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get status breakdown for a storyboard
 */
export function getStatusBreakdown(panels: StoryboardPanel[]): Record<string, number> {
  return {
    approved: panels.filter((p) => p.approved).length,
    pending: panels.filter((p) => !p.approved && !p.regenerating && !p.rejectionReason).length,
    regenerating: panels.filter((p) => p.regenerating).length,
    rejected: panels.filter((p) => p.rejectionReason).length,
  };
}
