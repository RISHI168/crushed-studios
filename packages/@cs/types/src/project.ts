/**
 * Project Domain Types
 */

import type { Genre, Era, ColorGrade, AspectRatio, FilmStock } from '@cs/constants';

export interface ProjectMeta {
  genre: Genre;
  era: Era;
  colorGrade: ColorGrade;
  aspectRatio: AspectRatio;
  filmStock: FilmStock;
  description?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  meta: ProjectMeta;
}

export interface ProjectMember {
  userId: string;
  role: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  logline: string;
  status: 'active' | 'completed' | 'archived' | 'draft';
  meta: ProjectMeta;
  owner: string;
  collaborators: ProjectMember[];
  scenesTotal: number;
  scenesLocked: number;
  scenesGenerated: number;
  creditUsed: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}
