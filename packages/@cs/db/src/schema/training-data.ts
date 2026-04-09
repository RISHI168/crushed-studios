/**
 * Training Data Database Tables
 */

import { pgTable, text, uuid, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const preferencePairs = pgTable('crushed_preference_pairs', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  promptId: uuid('prompt_id').notNull(),
  preferredOutputId: uuid('preferred_output_id').notNull(),
  rejectedOutputId: uuid('rejected_output_id').notNull(),
  feedback: text('feedback'),
  score: integer('score'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const trainingDatasets = pgTable('crushed_training_datasets', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  name: text('name').notNull(),
  description: text('description'),
  agentId: text('agent_id').notNull(),
  pairsCount: integer('pairs_count').default(0),
  quality: text('quality').default('raw'), // raw, filtered, validated
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const trainingRuns = pgTable('crushed_training_runs', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  modelVersionId: uuid('model_version_id').notNull(),
  datasetId: uuid('dataset_id').notNull(),
  status: text('status').default('pending'),
  config: jsonb('config'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  metrics: jsonb('metrics'),
});
