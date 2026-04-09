/**
 * Model Version and Evaluation Database Tables
 */

import { pgTable, text, uuid, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const modelVersions = pgTable('crushed_model_versions', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  agentId: text('agent_id').notNull(),
  version: text('version').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(false),
  modelPath: text('model_path'),
  loraPath: text('lora_path'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  trainedAt: timestamp('trained_at', { withTimezone: true }),
});

export const modelEvalResults = pgTable('crushed_model_eval_results', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  modelVersionId: uuid('model_version_id').notNull(),
  benchmark: text('benchmark').notNull(),
  score: integer('score'),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const promotionLogs = pgTable('crushed_promotion_logs', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  fromVersionId: uuid('from_version_id'),
  toVersionId: uuid('to_version_id').notNull(),
  agentId: text('agent_id').notNull(),
  reason: text('reason'),
  approvedBy: uuid('approved_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
