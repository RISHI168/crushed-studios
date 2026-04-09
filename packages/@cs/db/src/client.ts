/**
 * Database Client Setup
 * PostgreSQL connection using Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: postgres.Sql | null = null;

/**
 * Initialize database connection
 */
export function initializeDb(): postgres.Sql {
  if (client) return client;

  const connectionString =
    process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/crushed';

  client = postgres(connectionString);

  return client;
}

/**
 * Get Drizzle ORM instance
 */
export function getDb() {
  const sqlClient = initializeDb();
  return drizzle(sqlClient, { schema });
}

/**
 * Close database connection
 */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.end();
    client = null;
  }
}

/**
 * Health check for database connection
 */
export async function checkDbHealth(): Promise<boolean> {
  try {
    const sqlClient = initializeDb();
    await sqlClient`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
