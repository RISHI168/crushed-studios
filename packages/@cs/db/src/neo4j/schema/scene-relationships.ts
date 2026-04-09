/**
 * Scene Relationship Type Definitions for Neo4j
 */

/**
 * Character in Scene Relationship
 * Links a character state to a scene
 */
export interface CharacterInSceneRel {
  type: 'IN_SCENE';
  properties: {
    role: string;
    screenTime: number;
    blockingNotes: string;
  };
}

/**
 * Character Interaction Relationship
 * Links two characters in the same scene
 */
export interface InteractionRel {
  type: 'INTERACTS_WITH';
  properties: {
    sceneId: string;
    interaction: string;
    type: 'dialogue' | 'action' | 'reaction';
    intensity: number;
  };
}

/**
 * Emotional Arc Relationship
 * Tracks emotional change through scenes
 */
export interface EmotionalArcRel {
  type: 'EVOLVES_TO';
  properties: {
    fromSceneId: string;
    toSceneId: string;
    change: string;
    trigger: string;
  };
}

/**
 * Scene Sequence Relationship
 * Links scenes in order
 */
export interface SceneSequenceRel {
  type: 'FOLLOWS';
  properties: {
    sceneNumber: number;
  };
}
