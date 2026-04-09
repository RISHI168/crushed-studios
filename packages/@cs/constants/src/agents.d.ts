/**
 * Agent and Prompt Layer Constants
 * Extracted from monolith App.jsx Region 2e
 */
export declare const PROMPT_LAYERS: readonly [{
    readonly id: "screenplay";
    readonly label: "Screenplay Text";
    readonly color: "#1D9E75";
    readonly icon: "📜";
    readonly desc: "Action text, dialogue blocks, transition, beat classification, duration";
}, {
    readonly id: "characters";
    readonly label: "Character Identity Constraints";
    readonly color: "#7F77DD";
    readonly icon: "👤";
    readonly desc: "Physical attributes, LoRA refs, emotion, wardrobe, blocking, mannerisms per character";
}, {
    readonly id: "camera";
    readonly label: "Camera Configuration";
    readonly color: "#378ADD";
    readonly icon: "🎥";
    readonly desc: "Shot type, movement, lighting, atmosphere + derived lens/body from Production Bible";
}, {
    readonly id: "continuity";
    readonly label: "Continuity State";
    readonly color: "#BA7517";
    readonly icon: "🔗";
    readonly desc: "Scene position, carry-forward constraints, cross-scene validation rules";
}, {
    readonly id: "bible";
    readonly label: "Production Bible Baseline";
    readonly color: "#D85A30";
    readonly icon: "📖";
    readonly desc: "Genre, era, color grade, aspect ratio, film stock, camera body, lens type";
}, {
    readonly id: "validation";
    readonly label: "Validation Criteria";
    readonly color: "#E24B4A";
    readonly icon: "✓";
    readonly desc: "Post-generation checks: LoRA similarity, wardrobe match, blocking accuracy, duration";
}];
export declare const AGENT_ROSTER: readonly [{
    readonly id: "scriptwriter";
    readonly name: "Scriptwriter Agent";
    readonly color: "#1D9E75";
    readonly role: "Parse screenplay structure, extract dialogue blocks and action beats";
}, {
    readonly id: "continuity";
    readonly name: "Continuity Agent";
    readonly color: "#BA7517";
    readonly role: "Load cross-scene constraints, validate character state carry-forward";
}, {
    readonly id: "cinematography";
    readonly name: "Cinematography Agent";
    readonly color: "#378ADD";
    readonly role: "Resolve camera configuration against Production Bible baseline";
}, {
    readonly id: "storyboard";
    readonly name: "Storyboard Agent";
    readonly color: "#22D3EE";
    readonly role: "Reference approved panels as visual keyframe guidance";
}, {
    readonly id: "prompt";
    readonly name: "Prompt Assembly";
    readonly color: "#7F77DD";
    readonly role: "Merge all constraint layers into generation prompt";
}, {
    readonly id: "generation";
    readonly name: "Generation Engine";
    readonly color: "#F59E0B";
    readonly role: "Execute video generation via model pipeline";
}, {
    readonly id: "validation";
    readonly name: "Validation Agent";
    readonly color: "#E24B4A";
    readonly role: "Post-generation continuity and quality checks";
}];
export type PromptLayerId = typeof PROMPT_LAYERS[number]['id'];
export type AgentId = typeof AGENT_ROSTER[number]['id'];
//# sourceMappingURL=agents.d.ts.map