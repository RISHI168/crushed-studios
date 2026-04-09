/**
 * Continuity Edge Type Definitions for Neo4j
 * Identity Anchor Chain validation and carry-forward constraints
 */

/**
 * Identity Anchor Edge
 * Ensures character identity consistency across scenes
 */
export interface IdentityAnchorEdge {
  type: 'IDENTITY_ANCHOR';
  properties: {
    characterId: string;
    sceneId: string;
    attributes: Record<string, string>;
    validated: boolean;
    timestamp: string;
  };
}

/**
 * Carry-Forward Edge
 * Tracks character state transitions between scenes
 */
export interface CarryForwardEdge {
  type: 'CARRY_FORWARD';
  properties: {
    fromSceneId: string;
    toSceneId: string;
    characterId: string;
    constraints: Record<string, unknown>;
    validated: boolean;
    issues: string[];
  };
}

/**
 * Continuity Check Edge
 * Marks continuity validation results
 */
export interface ContinuityCheckEdge {
  type: 'CONTINUITY_CHECK';
  properties: {
    fromSceneId: string;
    toSceneId: string;
    characterId: string;
    passed: boolean;
    violations: string[];
    timestamp: string;
  };
}

/**
 * Relationship State Edge
 * Tracks relationship changes between characters
 */
export interface RelationshipStateEdge {
  type: 'RELATIONSHIP_STATE';
  properties: {
    character1Id: string;
    character2Id: string;
    sceneId: string;
    status: string;
    tension: number;
    history: string[];
  };
}
