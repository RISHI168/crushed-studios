/**
 * Generation and Video Output Database Tables
 */

import { pgTable, text, uuid, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const generations = pgTable('crushed_generations', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  sceneId: uuid('scene_id').notNull(),
  projectId: uuid('project_id').notNull(),
  userId: uuid('user_id').notNull(),
  status: text('status').default('pending'),
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'),
  credits: integer('credits'),
  rejectedBy: uuid('rejected_by'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const takes = pgTable('crushed_takes', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  generationId: uuid('generation_id').notNull(),
  takeNumber: integer('take_number'),
  videoUrl: text('video_url'),
  quality: text('quality'),
  approved: boolean('approved').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const agentLogs = pgTable('crushed_agent_logs', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  generationId: uuid('generation_id').notNull(),
  agentId: text('agent_id').notNull(),
  status: text('status'),
  output: text('output'),
  error: text('error'),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

export const storyboardPanels = pgTable('crushed_storyboard_panels', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  sceneId: uuid('scene_id').notNull(),
  panelNumber: integer('panel_number'),
  composition: text('composition'),
  content: text('content'),
  imageUrl: text('image_url'),
  approved: boolean('approved').default(false),
  regenerating: boolean('regenerating').default(false),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
