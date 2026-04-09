/**
 * Scene Domain Types
 */

import type { SceneStatusKey, BeatType, TransitionType } from '@cs/constants';

export interface DialogueBlock {
  id: string;
  characterId: string;
  character: string;
  dialogue: string;
  emotionalContext?: string;
  duration?: number;
}

export interface SceneComment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  resolved: boolean;
  replies?: SceneComment[];
}

export interface StoryboardPanel {
  id: string;
  sceneId: string;
  panelNumber: number;
  composition: string;
  content: string;
  approved?: boolean;
  regenerating?: boolean;
  rejectionReason?: string;
  imageUrl?: string;
}

export interface SceneStatus {
  key: SceneStatusKey;
  label: string;
  color: string;
  icon: string;
  desc: string;
}

export interface Scene {
  id: string;
  projectId: string;
  title: string;
  sceneNumber: number;
  heading: string;
  logline: string;
  status: SceneStatusKey;
  beatType: BeatType;
  transitionType?: TransitionType;
  duration: number;
  characters: string[];
  dialogue: DialogueBlock[];
  storyboardPanels: StoryboardPanel[];
  comments: SceneComment[];
  screenplay: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastEditedBy?: string;
}
