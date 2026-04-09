/**
 * Storyboard Constants
 * Extracted from monolith App.jsx Region 2d
 */

import { T } from '@cs/tokens';

export const PANEL_COMPOSITIONS = [
  'Wide establishing — full environment visible',
  'Two-shot — characters facing, tension framing',
  'Close-up reaction — emotional beat',
  'Over-shoulder — conversational depth',
  'Dutch angle — psychological unease',
  'Low angle — power/dominance',
  'High angle — vulnerability/isolation',
  'Extreme close-up — detail emphasis',
  'Silhouette — atmospheric mood',
  'Tracking movement — character in motion',
] as const;

export const PANEL_CONTENT_TYPES = [
  'action_beat',
  'dialogue_delivery',
  'camera_setup',
  'transition',
  'establishing',
] as const;

export const PANEL_BORDER_STATES = {
  approved: '#22c55e',
  pending: '#06b6d4',
  rejected: '#ef4444',
  regenerating: '#f59e0b',
} as const;

/**
 * Get the status of a panel based on its state
 */
export const getPanelStatus = (
  panel: Readonly<{ regenerating?: boolean; approved?: boolean }>,
): keyof typeof PANEL_BORDER_STATES => {
  if (panel.regenerating) return 'regenerating';
  if (panel.approved) return 'approved';
  return 'pending';
};

export const SB_COLORS = {
  pending: '#555',
  approved: T.GREEN,
  rejected: T.RED,
  regenerating: T.ORANGE,
} as const;

export type PanelComposition = typeof PANEL_COMPOSITIONS[number];
export type PanelContentType = typeof PANEL_CONTENT_TYPES[number];
export type PanelBorderState = keyof typeof PANEL_BORDER_STATES;
