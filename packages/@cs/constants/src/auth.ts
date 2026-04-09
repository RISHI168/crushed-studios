/**
 * Authentication and Authorization Constants
 * Extracted from monolith App.jsx Region 2f
 */

import { T } from '@cs/tokens';

export interface RolePermissions {
  screenplay: 'edit' | 'view' | 'none';
  console: 'edit' | 'view' | 'camera' | 'none';
  storyboard: 'edit' | 'approve' | 'view' | 'none';
  generate: boolean;
  review: 'full' | 'annotate' | 'none';
  audio: 'edit' | 'view' | 'none';
  timeline: 'edit' | 'view' | 'none';
  team: 'edit' | 'view' | 'none';
  budget: 'edit' | 'view' | 'none';
  statusGate: 'all' | 'reviewed' | 'locked' | 'none';
}

export const ROLES = {
  director: {
    label: 'Director',
    color: T.GOLD,
    icon: '🎬',
    desc: 'Full access — creative and technical decisions',
    can: {
      screenplay: 'edit',
      console: 'edit',
      storyboard: 'edit',
      generate: true,
      review: 'full',
      audio: 'edit',
      timeline: 'edit',
      team: 'edit',
      budget: 'view',
      statusGate: 'all',
    } as RolePermissions,
  },
  writer: {
    label: 'Writer',
    color: T.CYAN,
    icon: '✍️',
    desc: 'Screenplay editing, scene structure, dialogue',
    can: {
      screenplay: 'edit',
      console: 'view',
      storyboard: 'edit',
      generate: false,
      review: 'annotate',
      audio: 'none',
      timeline: 'none',
      team: 'none',
      budget: 'none',
      statusGate: 'reviewed',
    } as RolePermissions,
  },
  producer: {
    label: 'Producer',
    color: T.PURPLE,
    icon: '📊',
    desc: 'Approvals, budgets, timeline, team management',
    can: {
      screenplay: 'view',
      console: 'view',
      storyboard: 'approve',
      generate: true,
      review: 'full',
      audio: 'view',
      timeline: 'edit',
      team: 'edit',
      budget: 'edit',
      statusGate: 'locked',
    } as RolePermissions,
  },
  colorist: {
    label: 'Colorist',
    color: T.TEAL,
    icon: '🎨',
    desc: 'Color grading, camera settings, visual look',
    can: {
      screenplay: 'none',
      console: 'camera',
      storyboard: 'none',
      generate: false,
      review: 'annotate',
      audio: 'none',
      timeline: 'none',
      team: 'none',
      budget: 'none',
      statusGate: 'none',
    } as RolePermissions,
  },
  auditor: {
    label: 'Film Auditor',
    color: T.ORANGE,
    icon: '👁️',
    desc: 'Review output, annotate, approve or reject takes',
    can: {
      screenplay: 'none',
      console: 'none',
      storyboard: 'none',
      generate: false,
      review: 'full',
      audio: 'none',
      timeline: 'none',
      team: 'none',
      budget: 'none',
      statusGate: 'none',
    } as RolePermissions,
  },
} as const;

export const CREDIT_COSTS = {
  video: 100,
  storyboard: 20,
  audio: 10,
  regeneration: 80,
} as const;

export type RoleKey = keyof typeof ROLES;
