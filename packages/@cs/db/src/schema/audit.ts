/**
 * Audit Log Database Table
 */

import { pgTable, text, uuid, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const auditLogs = pgTable('crushed_audit_logs', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  userId: uuid('user_id').notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: uuid('resource_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
