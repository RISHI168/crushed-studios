/**
 * User, Team, and Permission Types
 */

import type { RoleKey } from '@cs/constants';

export interface Permission {
  resource: string;
  action: string;
  allowed: boolean;
}

export interface Role {
  key: RoleKey;
  label: string;
  color: string;
  icon: string;
  desc: string;
  permissions: Permission[];
}

export interface Team {
  id: string;
  name: string;
  plan: 'free' | 'creator' | 'pro' | 'studio' | 'enterprise';
  creditBalance: number;
  creditLimit: number;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: RoleKey;
  color: string;
  online: boolean;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}
