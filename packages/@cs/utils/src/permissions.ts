/**
 * Permission and Authorization Utilities
 * Check user permissions against role-based access control
 */

import { ROLES, type RoleKey } from '@cs/constants';

/**
 * Check if a user with a given role has permission for a specific action
 *
 * @param role - User's role
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @returns Whether action is permitted
 */
export function hasPermission(
  role: RoleKey,
  resource: keyof (typeof ROLES.director)['can'],
  action: string,
): boolean {
  const roleData = ROLES[role];
  if (!roleData) return false;

  const resourcePermission = roleData.can[resource];

  // Handle boolean permissions (like generate)
  if (typeof resourcePermission === 'boolean') {
    return resourcePermission && action === 'execute';
  }

  // Handle string permissions (edit, view, approve, etc.)
  if (typeof resourcePermission === 'string') {
    return resourcePermission === action || resourcePermission !== 'none';
  }

  return false;
}

/**
 * Check if a user can access a specific resource type
 *
 * @param role - User's role
 * @param resource - Resource type
 * @returns Whether resource is accessible
 */
export function canAccess(
  role: RoleKey,
  resource: keyof (typeof ROLES.director)['can'],
): boolean {
  const roleData = ROLES[role];
  if (!roleData) return false;

  const permission = roleData.can[resource];

  if (typeof permission === 'boolean') {
    return permission;
  }

  return permission !== 'none';
}

/**
 * Get all permissions for a role
 *
 * @param role - User's role
 * @returns Role permissions object
 */
export function getRolePermissions(role: RoleKey) {
  return ROLES[role]?.can;
}

/**
 * Check if a role can perform a generation operation
 */
export function canGenerate(role: RoleKey): boolean {
  return hasPermission(role, 'generate', 'execute');
}

/**
 * Check if a role can review and approve content
 */
export function canReview(role: RoleKey): boolean {
  return ROLES[role]?.can.review !== 'none';
}

/**
 * Check if a role can edit screenplay
 */
export function canEditScreenplay(role: RoleKey): boolean {
  return ROLES[role]?.can.screenplay === 'edit';
}

/**
 * Check if a role can manage team
 */
export function canManageTeam(role: RoleKey): boolean {
  return ROLES[role]?.can.team === 'edit';
}
