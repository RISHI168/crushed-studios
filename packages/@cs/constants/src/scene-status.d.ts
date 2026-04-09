/**
 * Scene Status Constants
 * Extracted from monolith App.jsx Region 2a
 */
export declare const SCENE_STATUS: {
    readonly DRAFT: {
        readonly key: "draft";
        readonly label: "DRAFT";
        readonly color: "#666";
        readonly icon: "✎";
        readonly desc: "Writing in progress";
    };
    readonly REVIEWED: {
        readonly key: "reviewed";
        readonly label: "REVIEWED";
        readonly color: "#3B82F6";
        readonly icon: "◎";
        readonly desc: "Script reviewed, awaiting lock";
    };
    readonly LOCKED: {
        readonly key: "locked";
        readonly label: "LOCKED";
        readonly color: "#22C55E";
        readonly icon: "🔒";
        readonly desc: "Script locked — ready for production";
    };
    readonly GENERATED: {
        readonly key: "generated";
        readonly label: "GENERATED";
        readonly color: "#F59E0B";
        readonly icon: "★";
        readonly desc: "Video generated from this script";
    };
};
export declare const STATUS_FLOW: readonly ["draft", "reviewed", "locked", "generated"];
export declare const BEAT_TYPES: readonly ["Setup", "Inciting Incident", "Rising Action", "Midpoint", "Complication", "Crisis", "Climax", "Resolution", "Denouement"];
export declare const TRANSITION_TYPES: readonly ["CUT TO:", "SMASH CUT TO:", "DISSOLVE TO:", "FADE TO:", "MATCH CUT TO:", "JUMP CUT TO:", "FADE TO BLACK.", "CONTINUOUS"];
export declare const SCENE_HEADINGS: readonly ["INT.", "EXT.", "INT./EXT.", "EXT./INT."];
export type SceneStatusKey = typeof STATUS_FLOW[number];
export type BeatType = typeof BEAT_TYPES[number];
export type TransitionType = typeof TRANSITION_TYPES[number];
export type SceneHeading = typeof SCENE_HEADINGS[number];
//# sourceMappingURL=scene-status.d.ts.map