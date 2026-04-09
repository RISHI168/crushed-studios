/**
 * Neo4j Driver Setup and Connection Management
 * Handles character state graph and relationship queries
 */

import neo4j from 'neo4j-driver';

let driver: neo4j.Driver | null = null;

/**
 * Initialize Neo4j driver connection
 */
export function initializeNeo4j(): neo4j.Driver {
  if (driver) return driver;

  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 30000,
  });

  return driver;
}

/**
 * Get Neo4j driver instance
 */
export function getNeo4jDriver(): neo4j.Driver {
  if (!driver) {
    return initializeNeo4j();
  }
  return driver;
}

/**
 * Close Neo4j connection
 */
export async function closeNeo4j(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

/**
 * Execute a Cypher query and return results
 */
export async function executeCypher<T = unknown>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  const driver = getNeo4jDriver();
  const session = driver.session();

  try {
    const result = await session.run(query, params);
    return result.records.map((record) => record.toObject() as T);
  } finally {
    await session.close();
  }
}

/**
 * Health check for Neo4j connection
 */
export async function checkNeo4jHealth(): Promise<boolean> {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();
    return true;
  } catch {
    return false;
  }
}
