/**
 * Asset Storage Database Tables
 * Phase 3 placeholder for asset management
 */

import { pgTable, text, uuid, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const assets = pgTable('crushed_assets', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid('project_id').notNull(),
  type: text('type').notNull(), // video, image, audio, etc.
  name: text('name').notNull(),
  description: text('description'),
  s3Key: text('s3_key').notNull(),
  url: text('url'),
  size: integer('size'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const assetVersions = pgTable('crushed_asset_versions', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  assetId: uuid('asset_id').notNull(),
  version: integer('version').default(1),
  s3Key: text('s3_key').notNull(),
  url: text('url'),
  size: integer('size'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
