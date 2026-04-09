/**
 * Storyboard Constants
 * Extracted from monolith App.jsx Region 2d
 */
export declare const PANEL_COMPOSITIONS: readonly ["Wide establishing — full environment visible", "Two-shot — characters facing, tension framing", "Close-up reaction — emotional beat", "Over-shoulder — conversational depth", "Dutch angle — psychological unease", "Low angle — power/dominance", "High angle — vulnerability/isolation", "Extreme close-up — detail emphasis", "Silhouette — atmospheric mood", "Tracking movement — character in motion"];
export declare const PANEL_CONTENT_TYPES: readonly ["action_beat", "dialogue_delivery", "camera_setup", "transition", "establishing"];
export declare const PANEL_BORDER_STATES: {
    readonly approved: "#22c55e";
    readonly pending: "#06b6d4";
    readonly rejected: "#ef4444";
    readonly regenerating: "#f59e0b";
};
/**
 * Get the status of a panel based on its state
 */
export declare const getPanelStatus: (panel: Readonly<{
    regenerating?: boolean;
    approved?: boolean;
}>) => keyof typeof PANEL_BORDER_STATES;
export declare const SB_COLORS: {
    readonly pending: "#555";
    readonly approved: "#22C55E";
    readonly rejected: "#EF4444";
    readonly regenerating: "#FB923C";
};
export type PanelComposition = typeof PANEL_COMPOSITIONS[number];
export type PanelContentType = typeof PANEL_CONTENT_TYPES[number];
export type PanelBorderState = keyof typeof PANEL_BORDER_STATES;
//# sourceMappingURL=storyboard.d.ts.map