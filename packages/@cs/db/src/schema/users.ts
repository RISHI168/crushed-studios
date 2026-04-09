/**
 * User, Team, and Session Database Tables
 */

import { pgTable, text, timestamp, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const roleEnum = pgEnum('role', [
  'director',
  'writer',
  'producer',
  'colorist',
  'auditor',
]);

export const teamPlanEnum = pgEnum('team_plan', [
  'free',
  'creator',
  'pro',
  'studio',
  'enterprise',
]);

export const users = pgTable('crushed_users', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  role: roleEnum('role').notNull().default('writer'),
  color: text('color').notNull(),
  teamId: uuid('team_id').notNull(),
  online: boolean('online').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const teams = pgTable('crushed_teams', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  plan: teamPlanEnum('plan').default('free'),
  creditBalance: text('credit_balance').default('0'),
  creditLimit: text('credit_limit').default('5000'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const sessions = pgTable('crushed_sessions', {
  id: uuid('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
