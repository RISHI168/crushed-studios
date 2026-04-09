/**
 * Validation Utilities
 * Scene structure, character consistency, and generation output validation
 */

import type { Scene } from '@cs/types';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a single scene for completeness and consistency
 * Checks screenplay format, character assignments, dialogue structure, etc.
 *
 * @param scene - Scene to validate
 * @returns Validation result with any errors found
 */
export function validateScene(scene: Scene): ValidationResult {
  const errors: ValidationError[] = [];

  // TODO: Implement full validation logic
  // 1. Check screenplay format (proper formatting, no empty sections)
  // 2. Validate dialogue blocks (each has character, dialogue, context)
  // 3. Verify all referenced characters exist
  // 4. Check scene status flow compliance
  // 5. Validate beat type and transition types
  // 6. Check storyboard panels consistency

  if (!scene.screenplay || scene.screenplay.length === 0) {
    errors.push({
      field: 'screenplay',
      message: 'Scene must have screenplay content',
      severity: 'error',
    });
  }

  if (!scene.characters || scene.characters.length === 0) {
    errors.push({
      field: 'characters',
      message: 'Scene must have at least one character',
      severity: 'error',
    });
  }

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
  };
}

/**
 * Validate all scenes in a project for internal consistency
 * Checks cross-scene references, character continuity, etc.
 *
 * @param scenes - All scenes to validate
 * @returns Validation result
 */
export function validateAllScenes(scenes: Scene[]): ValidationResult {
  const allErrors: ValidationError[] = [];

  for (const scene of scenes) {
    const result = validateScene(scene);
    allErrors.push(...result.errors);
  }

  // TODO: Add cross-scene validation
  // 1. Check character presence across scenes
  // 2. Validate scene numbering sequence
  // 3. Check beat flow across entire project
  // 4. Validate status flow progression

  return {
    valid: allErrors.filter((e) => e.severity === 'error').length === 0,
    errors: allErrors,
  };
}

/**
 * Validate a generated video output against generation constraints
 */
export function validateGenerationOutput(
  videoUrl: string,
  _constraints: Record<string, unknown>,
): ValidationResult {
  // TODO: Implement output validation
  // 1. Check video exists and is accessible
  // 2. Validate duration matches scene requirements
  // 3. Check LoRA similarity scores
  // 4. Validate wardrobe consistency
  // 5. Check character blocking accuracy

  return {
    valid: true,
    errors: [],
  };
}
