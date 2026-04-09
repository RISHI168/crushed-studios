/**
 * Agent and Prompt Layer Constants
 * Extracted from monolith App.jsx Region 2e
 */

import { T } from '@cs/tokens';

export const PROMPT_LAYERS = [
  {
    id: 'screenplay',
    label: 'Screenplay Text',
    color: '#1D9E75',
    icon: '📜',
    desc: 'Action text, dialogue blocks, transition, beat classification, duration',
  },
  {
    id: 'characters',
    label: 'Character Identity Constraints',
    color: '#7F77DD',
    icon: '👤',
    desc: 'Physical attributes, LoRA refs, emotion, wardrobe, blocking, mannerisms per character',
  },
  {
    id: 'camera',
    label: 'Camera Configuration',
    color: '#378ADD',
    icon: '🎥',
    desc: 'Shot type, movement, lighting, atmosphere + derived lens/body from Production Bible',
  },
  {
    id: 'continuity',
    label: 'Continuity State',
    color: '#BA7517',
    icon: '🔗',
    desc: 'Scene position, carry-forward constraints, cross-scene validation rules',
  },
  {
    id: 'bible',
    label: 'Production Bible Baseline',
    color: '#D85A30',
    icon: '📖',
    desc: 'Genre, era, color grade, aspect ratio, film stock, camera body, lens type',
  },
  {
    id: 'validation',
    label: 'Validation Criteria',
    color: '#E24B4A',
    icon: '✓',
    desc: 'Post-generation checks: LoRA similarity, wardrobe match, blocking accuracy, duration',
  },
] as const;

export const AGENT_ROSTER = [
  {
    id: 'scriptwriter',
    name: 'Scriptwriter Agent',
    color: '#1D9E75',
    role: 'Parse screenplay structure, extract dialogue blocks and action beats',
  },
  {
    id: 'continuity',
    name: 'Continuity Agent',
    color: '#BA7517',
    role: 'Load cross-scene constraints, validate character state carry-forward',
  },
  {
    id: 'cinematography',
    name: 'Cinematography Agent',
    color: '#378ADD',
    role: 'Resolve camera configuration against Production Bible baseline',
  },
  {
    id: 'storyboard',
    name: 'Storyboard Agent',
    color: T.CYAN,
    role: 'Reference approved panels as visual keyframe guidance',
  },
  {
    id: 'prompt',
    name: 'Prompt Assembly',
    color: '#7F77DD',
    role: 'Merge all constraint layers into generation prompt',
  },
  {
    id: 'generation',
    name: 'Generation Engine',
    color: T.GOLD,
    role: 'Execute video generation via model pipeline',
  },
  {
    id: 'validation',
    name: 'Validation Agent',
    color: '#E24B4A',
    role: 'Post-generation continuity and quality checks',
  },
] as const;

export type PromptLayerId = typeof PROMPT_LAYERS[number]['id'];
export type AgentId = typeof AGENT_ROSTER[number]['id'];
