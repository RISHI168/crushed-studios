# Crushed Studios — Production Console

**AI-powered film production pipeline: screenplay to finished video.**

Crushed Studios is an enterprise SaaS platform that orchestrates the complete creative pipeline — screenwriting, storyboarding, video generation, audio design, timeline editing, and continuity enforcement — through a multi-agent AI architecture with 230+ configurable parameters.

## Current State

| Metric | Value |
|--------|-------|
| Version | v6.1 (Phase 2 complete) |
| Lines | ~5,365 |
| Views | 7 (Dashboard + 6 project views) |
| Roles | 5 (Director, Writer, Producer, Colorist, Auditor) |
| State variables | 61 |
| Permission guards | 45 |

## Architecture

The codebase is currently a single-file JSX monolith (`src/App.jsx`) with region markers mapping to the planned multi-file extraction (see `docs/file-maps/`). Component extraction is planned for Build 0.4.

```
src/
├── App.jsx                    # Monolith (current) — see region index inside
├── constants/                 # Design tokens, scene/character/production enums
├── data/                      # Seed data, project data stores
├── utils/                     # Prompt assembly, validation, carry-forward
├── hooks/                     # State management, generation, persistence
├── components/                # UI components by domain
│   ├── shared/                # SectionHeader, TagSelect, StatusBadge, etc.
│   ├── layout/                # AppShell, Header, Footer
│   ├── dashboard/             # Project grid, cards, creation modal
│   ├── screenplay/            # Script editor, status pipeline, comments
│   ├── console/               # Production bible, camera, storyboard, agents
│   ├── characters/            # Character bible, identity cards
│   ├── continuity/            # Cross-scene validation, swim-lane graph
│   ├── review/                # Video review, annotations, take history
│   ├── audio/                 # 4-track mixer, waveforms
│   └── timeline/              # NLE editor, filmstrip, transport bar
├── api/                       # API contracts, mock adapters
├── styles/                    # Responsive CSS, global styles
└── views/                     # Top-level view containers
```

## Build Phases

| Phase | Purpose | Status |
|-------|---------|--------|
| 0 — Moat Visibility | Surface competitive advantages | Complete |
| 1 — Core Pipeline | Script-to-video loop | Complete |
| 2 — Enterprise Foundation | Auth, RBAC, approvals, versioning | Complete |
| 3 — Assets & Intelligence | Asset library, real AI APIs, LoRA | Planned |
| 4 — Distribution | Export, publish, analytics | Planned |
| 5 — Monetization | Credits, billing, API, hardening | Planned |

See `docs/build-trajectory.md` for the full roadmap.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend:** React 18 + JSX (single-file prototype, extraction planned)
- **Styling:** Inline styles with design token system
- **Fonts:** Bodoni Moda (display), Outfit (body), Space Mono (code)
- **Build:** Vite + esbuild
- **State:** React useState/useCallback (Context API planned for extraction)

## Competitive Moats

1. **Prompt Assembly Engine** — 6-layer constraint system (screenplay, character identity, camera config, continuity state, production bible, validation criteria) visible to users
2. **Continuity Engine** — Cross-scene character state tracking with carry-forward analysis
3. **Multi-Agent Orchestration** — 7 specialized AI agents with visible pipeline status

## License

Proprietary — All rights reserved. See [LICENSE](./LICENSE).
