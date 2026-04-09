/**
 * @cs/utils - Shared Utilities
 * Central export point for utility functions
 */

export {
  assemblePrompt,
  extractScreenplayText,
  buildCharacterConstraints,
  buildCameraConstraints,
} from './prompt-assembler';

export { getCarryForward, validateCarryForward, loadPreviousSceneStates } from './carry-forward';

export { validateScene, validateAllScenes, validateGenerationOutput } from './validation';

export { getStoryboardStats, getStatusBreakdown } from './storyboard-stats';

export {
  calculateCost,
  checkBalance,
  deductCredits,
  refundCredits,
  type CreditTransaction,
} from './credits';

export {
  hasPermission,
  canAccess,
  getRolePermissions,
  canGenerate,
  canReview,
  canEditScreenplay,
  canManageTeam,
} from './permissions';
