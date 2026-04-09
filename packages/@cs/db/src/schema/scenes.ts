/**
 * Scene Database Tables
 */

import { pgTable, text, uuid, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const scenes = pgTable('crushed_scenes', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid('project_id').notNull(),
  title: text('title').notNull(),
  sceneNumber: integer('scene_number').notNull(),
  heading: text('heading').notNull(),
  logline: text('logline'),
  status: text('status').default('draft'),
  beatType: text('beat_type'),
  transitionType: text('transition_type'),
  duration: integer('duration').default(0),
  characters: jsonb('characters').$type<string[]>().default([]),
  screenplay: text('screenplay'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'),
  lastEditedBy: uuid('last_edited_by'),
});

export const dialogueBlocks = pgTable('crushed_dialogue_blocks', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  sceneId: uuid('scene_id').notNull(),
  characterId: uuid('character_id'),
  character: text('character').notNull(),
  dialogue: text('dialogue').notNull(),
  emotionalContext: text('emotional_context'),
  duration: integer('duration'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const sceneComments = pgTable('crushed_scene_comments', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  sceneId: uuid('scene_id').notNull(),
  userId: uuid('user_id').notNull(),
  text: text('text').notNull(),
  resolved: boolean('resolved').default(false),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
  parentCommentId: uuid('parent_comment_id'),
});
