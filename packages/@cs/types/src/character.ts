/**
 * Character Domain Types
 */

import type { EmotionLabel, Mannerism, WardrobeItem } from '@cs/constants';

export interface CharIdentity {
  id: string;
  name: string;
  nickname?: string;
  description: string;
  age?: number;
  backstory?: string;
  goals?: string;
  fears?: string;
}

export interface Wardrobe {
  items: WardrobeItem[];
  description?: string;
  colorPalette?: string[];
  notes?: string;
}

export interface EmotionState {
  emotion: EmotionLabel;
  intensity: number;
  reason?: string;
  physicalManifestations?: Mannerism[];
}

export interface CharacterInScene {
  characterId: string;
  name: string;
  role?: string;
  emotionalState: EmotionState;
  wardrobe: Wardrobe;
  blocking?: string;
  mannerisms: Mannerism[];
  cameraFocus?: boolean;
}

export interface Character {
  id: string;
  projectId: string;
  identity: CharIdentity;
  wardrobe: Wardrobe;
  defaultEmotion: EmotionState;
  mannerisms: Mannerism[];
  physicalAttributes?: Record<string, string>;
  loraReference?: string;
  assignedColor: string;
  createdAt: string;
  updatedAt: string;
}
