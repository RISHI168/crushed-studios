/**
 * Character Database Tables
 */

import { pgTable, text, uuid, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const characters = pgTable('crushed_characters', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid('project_id').notNull(),
  name: text('name').notNull(),
  nickname: text('nickname'),
  description: text('description'),
  age: integer('age'),
  backstory: text('backstory'),
  goals: text('goals'),
  fears: text('fears'),
  wardrobeDescription: text('wardrobe_description'),
  wardrobeItems: jsonb('wardrobe_items').$type<string[]>(),
  colorPalette: jsonb('color_palette').$type<string[]>(),
  defaultEmotion: text('default_emotion'),
  mannerisms: jsonb('mannerisms').$type<string[]>(),
  physicalAttributes: jsonb('physical_attributes').$type<Record<string, string>>(),
  loraReference: text('lora_reference'),
  assignedColor: text('assigned_color'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const characterStates = pgTable('crushed_character_states', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  sceneId: uuid('scene_id').notNull(),
  characterId: uuid('character_id').notNull(),
  emotionalState: text('emotional_state'),
  emotionalIntensity: integer('emotional_intensity'),
  wardrobe: text('wardrobe'),
  blocking: text('blocking'),
  cameraFocus: integer('camera_focus'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
