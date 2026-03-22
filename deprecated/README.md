# Deprecated Builds

Historical monolith snapshots from each build phase. These are the full single-file JSX versions that were superseded by subsequent builds. Kept for reference and rollback purposes.

**Do not import from these files.** The current production code lives in `src/App.jsx`.

## Phase 0 — Moat Visibility
- `build-0.1-prompt-assembly-preview.jsx` — Added 6-layer prompt assembly panel
- `build-0.2-continuity-context-panel.jsx` — Added carry-forward analysis + swim-lane graph
- `build-0.3-agent-activity-feed.jsx` — Added 7-agent orchestration feed

## Phase 1 — Core Pipeline
- `build-1.1-api-contract-layer.jsx` — API types + mock adapter pattern
- `build-1.2-video-review-interface.jsx` — Video review with annotations + takes
- `build-1.3-audio-sound-design.jsx` — 4-track audio mixer
- `build-1.4-timeline-editor.jsx` — NLE timeline with filmstrip tracks
- `build-1.5-state-persistence-pre-audit.jsx` — localStorage + export/import (pre-QA)
- `build-1.5-state-persistence-final.jsx` — State persistence (post-QA, final)

## Phase 2 — Enterprise Foundation
- `build-2.2-project-dashboard.jsx` — Multi-project dashboard snapshot
