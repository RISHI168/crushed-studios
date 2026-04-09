/**
 * Gradient Tokens for Crushed Studios Design System
 * Extracted from monolith App.jsx Region 1
 */

import { T } from './colors';

/**
 * Primary accent gradient - Gold to Orange
 * Used for CTAs, highlights, and premium UI elements
 */
export const ACCENT = 'linear-gradient(135deg, #F59E0B, #D97706)';

/**
 * Character color palette for assignment and visual differentiation
 * Used to color-code different characters in the system
 */
export const CHAR_COLORS = [
  T.CYAN,    // #22D3EE
  T.PINK,    // #F472B6
  T.PURPLE,  // #A78BFA
  T.ORANGE,  // #FB923C
  T.GREEN,   // #22C55E
  '#FCD34D', // Yellow
  T.BLUE,    // #3B82F6
  '#F97316', // Red-Orange
] as const;

export type CharColor = typeof CHAR_COLORS[number];

/**
 * Gradient utilities
 */
export const GRADIENTS = {
  accent: ACCENT,
  charColors: CHAR_COLORS,
} as const;
