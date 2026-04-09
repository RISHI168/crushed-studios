/**
 * Character Node Type Definitions for Neo4j
 */

/**
 * Character Identity Node
 * Represents the core identity of a character
 */
export interface CharacterNode {
  id: string;
  name: string;
  projectId: string;
  nicknames: string[];
  description: string;
  loraReference?: string;
}

/**
 * Character State Node
 * Represents character state in a specific scene
 */
export interface CharacterStateNode {
  id: string;
  characterId: string;
  sceneId: string;
  sceneNumber: number;
  emotionalState: string;
  emotionalIntensity: number;
  wardrobe: string;
  physicalChanges: string[];
  objectives: string[];
  relationships: Record<string, string>;
  timestamp: string;
}

/**
 * Emotional State Node
 * Tracks emotional evolution
 */
export interface EmotionalStateNode {
  id: string;
  characterId: string;
  emotion: string;
  intensity: number;
  reason: string;
  manifestation: string;
  timestamp: string;
}
