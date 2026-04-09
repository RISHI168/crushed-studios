/**
 * Authentication and Authorization Constants
 * Extracted from monolith App.jsx Region 2f
 */
export interface RolePermissions {
    screenplay: 'edit' | 'view' | 'none';
    console: 'edit' | 'view' | 'camera' | 'none';
    storyboard: 'edit' | 'approve' | 'view' | 'none';
    generate: boolean;
    review: 'full' | 'annotate' | 'none';
    audio: 'edit' | 'view' | 'none';
    timeline: 'edit' | 'view' | 'none';
    team: 'edit' | 'view' | 'none';
    budget: 'edit' | 'view' | 'none';
    statusGate: 'all' | 'reviewed' | 'locked' | 'none';
}
export declare const ROLES: {
    readonly director: {
        readonly label: "Director";
        readonly color: "#F59E0B";
        readonly icon: "🎬";
        readonly desc: "Full access — creative and technical decisions";
        readonly can: RolePermissions;
    };
    readonly writer: {
        readonly label: "Writer";
        readonly color: "#22D3EE";
        readonly icon: "✍️";
        readonly desc: "Screenplay editing, scene structure, dialogue";
        readonly can: RolePermissions;
    };
    readonly producer: {
        readonly label: "Producer";
        readonly color: "#A78BFA";
        readonly icon: "📊";
        readonly desc: "Approvals, budgets, timeline, team management";
        readonly can: RolePermissions;
    };
    readonly colorist: {
        readonly label: "Colorist";
        readonly color: "#2DD4BF";
        readonly icon: "🎨";
        readonly desc: "Color grading, camera settings, visual look";
        readonly can: RolePermissions;
    };
    readonly auditor: {
        readonly label: "Film Auditor";
        readonly color: "#FB923C";
        readonly icon: "👁️";
        readonly desc: "Review output, annotate, approve or reject takes";
        readonly can: RolePermissions;
    };
};
export declare const CREDIT_COSTS: {
    readonly video: 100;
    readonly storyboard: 20;
    readonly audio: 10;
    readonly regeneration: 80;
};
export type RoleKey = keyof typeof ROLES;
//# sourceMappingURL=auth.d.ts.map