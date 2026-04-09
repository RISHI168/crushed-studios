/**
 * Project Database Tables
 */

import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const projects = pgTable('crushed_projects', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  title: text('title').notNull(),
  logline: text('logline'),
  genre: text('genre'),
  era: text('era'),
  colorGrade: text('color_grade'),
  aspectRatio: text('aspect_ratio'),
  filmStock: text('film_stock'),
  status: text('status').default('draft'),
  owner: uuid('owner').notNull(),
  thumbnail: text('thumbnail'),
  scenesTotal: integer('scenes_total').default(0),
  scenesLocked: integer('scenes_locked').default(0),
  scenesGenerated: integer('scenes_generated').default(0),
  creditUsed: integer('credit_used').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const projectMembers = pgTable('crushed_project_members', {
  id: uuid('id').primaryKey().defaultValue(() => createId() as string),
  projectId: uuid('project_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: text('role').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
});
