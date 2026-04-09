/**
 * Scene Status Constants
 * Extracted from monolith App.jsx Region 2a
 */
import { T } from '@cs/tokens';
export const SCENE_STATUS = {
    DRAFT: {
        key: 'draft',
        label: 'DRAFT',
        color: '#666',
        icon: '✎',
        desc: 'Writing in progress',
    },
    REVIEWED: {
        key: 'reviewed',
        label: 'REVIEWED',
        color: T.BLUE,
        icon: '◎',
        desc: 'Script reviewed, awaiting lock',
    },
    LOCKED: {
        key: 'locked',
        label: 'LOCKED',
        color: T.GREEN,
        icon: '🔒',
        desc: 'Script locked — ready for production',
    },
    GENERATED: {
        key: 'generated',
        label: 'GENERATED',
        color: T.GOLD,
        icon: '★',
        desc: 'Video generated from this script',
    },
};
export const STATUS_FLOW = ['draft', 'reviewed', 'locked', 'generated'];
export const BEAT_TYPES = [
    'Setup',
    'Inciting Incident',
    'Rising Action',
    'Midpoint',
    'Complication',
    'Crisis',
    'Climax',
    'Resolution',
    'Denouement',
];
export const TRANSITION_TYPES = [
    'CUT TO:',
    'SMASH CUT TO:',
    'DISSOLVE TO:',
    'FADE TO:',
    'MATCH CUT TO:',
    'JUMP CUT TO:',
    'FADE TO BLACK.',
    'CONTINUOUS',
];
export const SCENE_HEADINGS = ['INT.', 'EXT.', 'INT./EXT.', 'EXT./INT.'];
//# sourceMappingURL=scene-status.js.map