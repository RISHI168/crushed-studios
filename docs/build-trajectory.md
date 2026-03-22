# Crushed Studios — Complete Build Trajectory
## Prototype → Production Enterprise SaaS
### March 2026

---

## Current State

| Metric | Value |
|--------|-------|
| Codebase | Single JSX file, 2,003 lines |
| Views | 4 (Screenplay, Console, Characters, Continuity) |
| Sections | 12 interactive panels |
| State variables | 18 (all useState, no persistence) |
| Components | 9 shared (SH, TagSelect, MultiTag, StatusBadge, VBadge, Tip, ScriptPreview, StatusPipeline, EmotionArc) |
| PRD coverage | Layer 0 complete, Layer 1 partial (1 of 4 features) |
| Enterprise features | None |
| API integration | None (all simulated with setTimeout) |

---

## Phase 0 — Moat Visibility & Architecture Prep
**Goal:** Make the three competitive moats visible in the product while beginning the architectural foundation for everything that follows.

### Build 0.1 — Prompt Assembly Preview ← YOU ARE HERE
**What:** Live, expandable panel in the Scene Console showing exactly what the engine will send to the generation model — six constraint layers (screenplay text, character identity, camera config, continuity state, production bible, validation criteria) with per-layer token counts and expandable detail views.

**Where in console:** Between Production Bible and Generate button.

**Why first:** Highest-impact enterprise demo feature. Makes the entire 230-parameter configurator feel purposeful — every setting the user configures visibly flows into the assembled prompt. Also establishes the data transformation pattern (scene state → structured prompt) that the real API integration will use later.

**Deliverables:**
- `assemblePrompt(scene, chars, bible)` function that composes all six layers from current state
- Collapsible layer-stack UI with token estimation per layer
- Token proportion bar showing relative layer weights
- Live reactivity — changing any scene parameter updates the prompt preview

**Estimated lines:** ~300 new lines
**Cumulative:** ~2,300 lines

---

### Build 0.2 — Continuity Context Panel
**What:** Two components. First, a carry-forward summary card in the Scene Console (between Production Bible and Prompt Assembly) showing what the Continuity Engine knows about each character entering this scene — previous emotion, wardrobe state, flagged jumps, constraint count. Second, a horizontal swim-lane graph in the Continuity tab showing character state threading across scenes (replacing the flat validation matrix as the primary visualization).

**Deliverables:**
- `getCarryForward(sceneId, scenes, chars)` function computing per-character state diff
- Continuity Context card with collapsed/expanded states
- Constraint counter that updates live as scene parameters change
- SVG swim-lane graph component for the Continuity tab
- Nodes representing character state snapshots, edges colored by continuity status

**Estimated lines:** ~350 new lines
**Cumulative:** ~2,650 lines

---

### Build 0.3 — Agent Activity Feed
**What:** A badge/feed component that shows agent orchestration status. At rest: single-line badge ("5 agents ready · 47 constraints active"). During generation: expands into a vertical timeline showing each agent reporting in with staggered timing. After generation: collapses with "View generation log" link.

**Deliverables:**
- `AGENT_ROSTER` constant defining all agents, their roles, colors, and data dependencies
- Staged generation simulation replacing the single setTimeout with a multi-step sequence
- Agent timeline component with spinning/complete/warning status indicators
- Generation log state that persists after completion
- Badge component for at-rest state

**Estimated lines:** ~250 new lines
**Cumulative:** ~2,900 lines

---

### Build 0.4 — Component Extraction & File Architecture
**What:** Refactor the monolith into a component architecture before it grows further. This is the last point where extraction is cheap — after Phase 1 adds three more major features, the cost triples.

**Deliverables:**
- `/tokens.js` — Design tokens, constants, enums
- `/data.js` — Seed data, initial state factories
- `/components/shared/` — SH, TagSelect, MultiTag, StatusBadge, VBadge, Tip, EmotionArc
- `/components/screenplay/` — ScriptPreview, StatusPipeline, SceneEditor, ActStructure
- `/components/console/` — CinematographyPanel, CharacterInScene, ProductionBible, StoryboardGenerator, PromptAssembly, ContinuityContext, AgentActivityFeed
- `/components/characters/` — CharacterCard, CharacterBible
- `/components/continuity/` — ValidationMatrix, SwimLaneGraph, CameraContinuity
- `/hooks/` — useScenes, useChars, useBible, useStoryboard
- `/utils/` — assemblePrompt, validateContinuity, getCarryForward
- Root `App.jsx` — view routing, layout, scene timeline

**Impact:** Every subsequent build becomes 2-3x faster because features are isolated and testable independently.

**Estimated effort:** Restructure only, no new features. Net zero new lines (same code, different files).
**Cumulative:** ~2,900 lines across ~25 files

---

## Phase 1 — Complete the Core Creative Pipeline
**Goal:** Close the script-to-finished-video loop. After this phase, a user can write a screenplay, generate storyboards, generate video, review it, add audio, and assemble scenes into a film. This is the minimum product that delivers the core value proposition.

### Build 1.1 — API Contract Layer + Mock Adapters
**What:** Define typed interfaces for every agent interaction and build a mock adapter layer that can be swapped to real endpoints. This decouples frontend development from backend availability.

**Deliverables:**
- `/api/types.ts` — TypeScript interfaces for all agent requests/responses (GenerateStoryboardRequest, GenerateVideoRequest, AnalyzeScriptRequest, GenerateAudioRequest, etc.)
- `/api/mock/` — Mock implementations returning realistic simulated data with configurable delays
- `/api/client.ts` — Unified API client with adapter pattern (mock ↔ real swap via config)
- Error types for every failure mode (timeout, partial result, queue position, credit exhausted)
- Loading/error/success state hooks for each operation

**Why now:** Every feature in Phase 1 involves async operations. Building the contract layer once means all four features share the same data-fetching patterns, error handling, and state management.

**Estimated lines:** ~500 (types + mocks + client)
**Cumulative:** ~3,400 lines

---

### Build 1.2 — Video Generation Output & Review Interface
**What:** The most critical missing feature. When the user clicks Generate Scene, this is where the output lands. A dedicated full-width review view (exits the standard tab layout per PRD §3.2).

**Deliverables:**
- New view: `review` (fifth view option, accessible from Console after generation)
- Video player component with frame-by-frame scrubbing, playback speed control (0.25x-2x), loop toggle
- Storyboard comparison panel — approved storyboard panel vs. generated frame, side-by-side with alignment markers
- Continuity validation results display — auto-run post-generation, showing pass/fail per constraint with the Continuity Engine output
- Script sync timeline — screenplay text synced to video timecodes, highlighting the current dialogue/action block as the video plays
- Frame annotation canvas — circle/rectangle drawing tools overlaid on video frames for feedback
- "Regenerate with Corrections" flow — annotations converted to prompt modifiers, fed back into the pipeline with the Agent Activity Feed showing the correction cycle
- Take versioning — previous generations preserved, A/B comparison slider between takes
- Status transition: scene status moves to GENERATED on user approval
- Generation queue indicator showing position and estimated time (from API contract layer)

**Estimated lines:** ~1,200 new lines
**Cumulative:** ~4,600 lines

---

### Build 1.3 — Audio & Sound Design
**What:** Four-track audio system that makes generated video watchable. New sub-section within the Console view, appearing after video generation for a scene.

**Deliverables:**
- Audio section in Console (visible only for GENERATED scenes)
- 4-track mixer UI: Dialogue TTS, Score/Music, Ambience, SFX
- Per-track controls: AI-generate (with genre/mood parameters), upload from library, mute, solo, volume slider
- Waveform visualization per track (simulated initially, real with WaveSurfer.js when audio APIs integrate)
- Master mix preview with combined volume balancing
- Track-level regeneration with text guidance
- Audio state stored per scene: `scene.audio = { tracks: [{type, source, volume, muted, waveform}], masterVolume }`
- Agent Activity Feed integration — Audio Agent appears in the generation timeline

**Estimated lines:** ~600 new lines
**Cumulative:** ~5,200 lines

---

### Build 1.4 — Timeline Editor / NLE
**What:** Fifth top-level tab that composes individual scene clips into the finished film. The assembly workspace.

**Deliverables:**
- New view: `timeline` (sixth view option in the tab bar)
- Horizontal multi-track timeline with zoom/pan controls and playhead
- Scene clips as draggable blocks, color-coded by act, showing thumbnails from storyboard panel 1
- Transition engine — auto-applies transitions from screenplay transition types (CUT TO → hard cut, DISSOLVE TO → crossfade, SMASH CUT → flash cut, etc.) with manual override
- 4 audio tracks per scene visible below video track, plus 1 project-level music track
- Volume automation curves (click-to-add keyframe points on volume line)
- Text overlay system — title cards, location supers, character name lower-thirds, credits. Overlays as a separate track above video.
- Scene-level color correction controls on top of Production Bible baseline (exposure, contrast, saturation, temperature sliders)
- Trim handles on clips (adjust in/out points), drag to reorder within acts, split clips at playhead
- Render quality toggle (proxy for editing, full quality for export)
- Real-time preview composition using canvas layering
- Export button (disabled in prototype, ready for Layer 5 integration)

**Estimated lines:** ~1,200 new lines
**Cumulative:** ~6,400 lines

---

### Build 1.5 — State Persistence & Autosave
**What:** Before moving to enterprise features, ensure no user work is lost. Add localStorage persistence as immediate win, then structured save/load.

**Deliverables:**
- Auto-save to localStorage on every state change (debounced 2s)
- Manual save/load with named project slots
- "Unsaved changes" indicator in header
- Project export as JSON (complete state dump for backup/transfer)
- Project import from JSON
- Clear/reset project with confirmation
- Version stamp in saved data for migration compatibility

**Estimated lines:** ~200 new lines
**Cumulative:** ~6,600 lines

---

## Phase 2 — Enterprise Foundation
**Goal:** Transform from single-user creative tool into a team-enabled platform with governance, review workflows, and role-based access. This is the unlock for Studio ($499/mo) and Enterprise ($1,499/mo) pricing.

### Build 2.1 — Authentication & User Model
**What:** User accounts, team creation, session management. The foundation for everything in Layer 2.

**Deliverables:**
- Auth flow: signup, login, password reset, session management
- User model: id, name, email, avatar, role, teamId, preferences
- Team model: id, name, owner, members[], plan tier, credit balance
- Auth context provider wrapping the entire app
- Protected routes — unauthenticated users see landing/login only
- User avatar/menu in header with account settings
- API client updated to include auth tokens in all requests

**Estimated lines:** ~500 new lines
**Cumulative:** ~7,100 lines

---

### Build 2.2 — Project Dashboard & Multi-Project Architecture
**What:** The landing page after login. Project CRUD, project switching, portfolio view. Replaces the current single-project assumption.

**Deliverables:**
- New view: `dashboard` (landing page, shown before any project is opened)
- Project cards: title, thumbnail (from first storyboard panel or generated frame), progress bar (scenes locked / total), team avatars, last activity timestamp, status (active/completed/archived)
- Create new project flow (title, logline, template selection)
- Duplicate project (as template)
- Archive/delete with confirmation
- Project data isolation — each project gets its own scenes, chars, bible, screenplay state
- Project switching without page reload
- Recent projects quick-access in header
- Filters: by status, by team member, by date range
- Search across project titles and loglines

**Estimated lines:** ~600 new lines
**Cumulative:** ~7,700 lines

---

### Build 2.3 — Role-Based Access Control
**What:** Five roles from PRD §4.1 (Director, Writer, Producer, Colorist, Client Reviewer) with permission boundaries controlling which tabs, actions, and data each role can access.

**Deliverables:**
- Role definitions with permission matrix (which views, which actions, which data mutations each role can perform)
- Permission guard component wrapping every restricted action
- Degraded UI per role — hidden tabs, disabled buttons, read-only fields for insufficient permissions
- Team member management: invite via email with role assignment, change role, remove member
- Activity feed on project dashboard showing real-time updates (who edited what, status changes, generation events)
- Presence indicators showing who is currently viewing each scene

**Estimated lines:** ~400 new lines
**Cumulative:** ~8,100 lines

---

### Build 2.4 — Review & Approval Workflows
**What:** The status pipeline (Draft → Reviewed → Locked → Generated) gets assignable reviewers and approval gates instead of self-service advancement.

**Deliverables:**
- Approval chain: each status transition can require sign-off from a specific role
  - Draft → Reviewed: Writer self-advances or assigns peer reviewer
  - Reviewed → Locked: Requires Director or Producer approval
  - Generated → Approved: Director sign-off in Review Interface
- Comment system with four anchor types:
  - Inline on screenplay text (character-level anchoring, like Google Docs)
  - Anchored to storyboard panels (panel-specific, visible in expanded view)
  - Timestamped on video frames (linked to timecodes in Review Interface)
  - Scene-level (general feedback)
- Comment threading: replies, resolution marking, @-mentions
- Notification system: in-app notification bell, unread count badge
- Audit trail: every status transition logs who, when, and any attached comments
- Client review links: password-protected, time-limited URLs for external stakeholders

**Estimated lines:** ~800 new lines
**Cumulative:** ~8,900 lines

---

### Build 2.5 — Version Control & Branching
**What:** Every edit creates a version snapshot. Users can view history, create branches, compare, and merge.

**Deliverables:**
- Version history panel accessible from every view (screenplay, console, storyboard)
- Timeline of all changes with who/when/what and diff indicators
- Diff view between any two versions (screenplay text diff, parameter diff, storyboard panel diff)
- Branch creation: fork a scene or act to explore creative alternatives
- Branch comparison: side-by-side screenplay diff, storyboard comparison, generated video A/B
- Merge: select winning branch, merge to main, manual conflict resolution for same-field edits
- Version state stored per entity (scene, character, bible) with parent pointers for branch trees

**Estimated lines:** ~700 new lines
**Cumulative:** ~9,600 lines

---

## Phase 3 — Asset Management & Intelligence
**Goal:** Enable asset reuse across projects and surface the AI intelligence layer that differentiates the platform from raw model APIs.

### Build 3.1 — Asset Library
**What:** Workspace-level storage for characters, locations, props, and creative direction that can be imported into any project.

**Deliverables:**
- Asset Library view (accessible from dashboard, not inside a project)
- Asset types: Characters (with LoRA models, identity cards, wardrobe sets), Locations (with lighting/atmosphere presets), Production Presets (bible configurations), Props
- Import assets into project from library with link-to-source
- Library-level updates optionally cascade to projects using that asset
- Asset metadata: tags, categories, usage count, last modified
- Search and filter across asset library
- Thumbnail generation for visual assets

**Estimated lines:** ~600 new lines
**Cumulative:** ~10,200 lines

---

### Build 3.2 — Template Library
**What:** Pre-built project structures for common formats that accelerate project creation.

**Deliverables:**
- Template catalog: 30-second ad, 60-second trailer, 5-minute short film, product demo, music video, corporate training
- Each template includes: act structure, suggested beat patterns, Production Bible presets, sample screenplay text
- Template browser with preview (shows structure before creation)
- Create-from-template flow integrated into project creation
- Custom template creation from existing projects ("Save as template")

**Estimated lines:** ~400 new lines
**Cumulative:** ~10,600 lines

---

### Build 3.3 — Brand Kit (Enterprise)
**What:** Brand governance system extending the Production Bible for companies producing branded content at scale.

**Deliverables:**
- Brand Kit configuration (workspace-level, applies across projects)
- Approved color palettes constraining Production Bible color grade options
- Logo placement rules: position, size, timing, scene types
- Typography presets for text overlays, title cards, lower thirds
- Approved talent/character models — only pre-approved LoRA characters usable
- Tone-of-voice guidelines constraining Scriptwriter Agent suggestions
- Template enforcement — mandate specific templates for content types
- Brand compliance badge on project cards showing adherence status

**Estimated lines:** ~500 new lines
**Cumulative:** ~11,100 lines

---

### Build 3.4 — AI Agent Integration (Real APIs)
**What:** Replace all mock adapters with real API integrations. This is where the Prompt Assembly Preview and Agent Activity Feed become live production features instead of simulations.

**Deliverables:**
- Swap mock adapters for real endpoints in the API client layer
- Storyboard Agent: real image generation via Flux/SDXL with LoRA adapters
- Scriptwriter Agent: real LLM integration for scene generation, dialogue polish, pacing analysis
- Continuity Agent: real embedding similarity checks post-generation
- Cinematography Agent: real camera parameter validation and suggestion
- Audio Agent: real TTS for dialogue, score generation, ambience/SFX
- Generation queue with WebSocket status updates (queue position, estimated time, progress stages)
- Error handling for every real failure mode (GPU timeout, model unavailable, LoRA not trained, credit exhausted, NSFW filter, etc.)
- Retry logic with exponential backoff
- Credit consumption tracking per operation

**Estimated lines:** ~800 (replacing mocks + adding real error handling + WebSocket integration)
**Cumulative:** ~11,900 lines

---

### Build 3.5 — LoRA Training Pipeline UI
**What:** User-facing interface for training character and location LoRA adapters.

**Deliverables:**
- Training wizard in Character Bible: upload 10-20 reference images → preview → train → version
- Training progress indicator with estimated time (~10 minutes per adapter)
- LoRA version management: list trained adapters, compare versions, set active version
- Training history with cost tracking
- Location LoRA: same flow for consistent environment generation
- Training credit consumption display

**Estimated lines:** ~400 new lines
**Cumulative:** ~12,300 lines

---

## Phase 4 — Distribution & Output
**Goal:** Get finished content out of the platform and into the world. Export, publish, analyze.

### Build 4.1 — Export Pipeline
**What:** Multi-format, multi-resolution export from the Timeline Editor.

**Deliverables:**
- Video export: 720p, 1080p, 4K resolution options with codec selection
- Multi-aspect ratio export from single source: 2.39:1 (cinema), 16:9 (YouTube), 1:1 (Instagram feed), 9:16 (Stories/Reels) with AI-driven subject-tracking reframing
- Per-scene reframing crop preview and manual adjustment
- Companion outputs:
  - Subtitle/caption files (SRT/VTT) auto-generated from screenplay dialogue with timecodes
  - Screenplay PDF export (industry-standard formatting)
  - Storyboard PDF export (panel grid with annotations)
  - Production book export (character bibles, continuity notes, camera logs)
  - Audio stems (separate dialogue, score, ambience, SFX files)
- Export queue with progress tracking
- Download management page

**Estimated lines:** ~600 new lines
**Cumulative:** ~12,900 lines

---

### Build 4.2 — Publish & Share
**What:** Direct publishing to platforms and shareable review infrastructure.

**Deliverables:**
- Platform API integrations: YouTube, Vimeo, Instagram, TikTok (OAuth + upload)
- Publish workflow: select platforms, add metadata (title, description, tags), schedule or publish immediately
- Shareable review links: password-protected, time-limited URLs with annotation support
- Embeddable player: iframe embed code for websites and portfolios
- Crushed Studios portfolio page: public showcase per creator/studio with customizable branding
- Publish history and status tracking per project

**Estimated lines:** ~500 new lines
**Cumulative:** ~13,400 lines

---

### Build 4.3 — Analytics Dashboard
**What:** Post-publish performance tracking connected to distribution channels.

**Deliverables:**
- Analytics view accessible from project dashboard and portfolio
- View counts, watch time, audience retention curves mapped to specific scenes
- Drop-off analysis: identify which scene causes most viewer exits, linked to screenplay beats
- A/B variant performance: compare audience metrics for different takes of the same scene
- Engagement metrics: likes, shares, comments, saves per platform
- Revenue tracking for monetized content: ad revenue, licensing income, per-platform breakdown
- Time-range filters and export to CSV

**Estimated lines:** ~500 new lines
**Cumulative:** ~13,900 lines

---

## Phase 5 — Monetization & Platform Hardening
**Goal:** Credit metering, subscription enforcement, API access, and the infrastructure hardening needed for production enterprise deployment.

### Build 5.1 — Credit Metering & Subscription Tiers
**What:** The credit-based pricing model from PRD §8.1 enforced in the product.

**Deliverables:**
- Credit balance display in header (real-time, updates on every generation)
- Per-operation credit cost display before execution ("This generation will use 1 credit")
- Tier-based feature gating: Free (watermarked, 720p, 3 credits), Creator ($29, 1080p, 25 credits), Pro ($149, 4K, 100 credits), Studio ($499, 300 credits, 5 seats), Enterprise ($1,499, 1,000 credits, unlimited seats)
- Resolution cost multipliers: 720p = 0.5x, 1080p = 1x, 4K = 3x
- Credit usage dashboard: consumption history, burn rate, projected exhaustion date
- Overage handling: prompt to purchase additional credits when balance is low
- Low-credit warnings at 20% and 5% remaining

**Estimated lines:** ~400 new lines
**Cumulative:** ~14,300 lines

---

### Build 5.2 — Billing & Payments
**What:** Stripe integration for subscription management and overage billing.

**Deliverables:**
- Stripe Checkout integration for subscription signup and upgrades
- Billing settings page: current plan, payment method, billing history, invoices
- Plan comparison page with feature matrix
- Upgrade/downgrade flow with prorated billing
- Overage credit purchase (one-time credit packs)
- Annual vs. monthly pricing toggle
- Enterprise custom pricing request flow
- Dunning management (failed payment handling, grace period, account suspension)

**Estimated lines:** ~400 new lines
**Cumulative:** ~14,700 lines

---

### Build 5.3 — Enterprise API Access
**What:** Public API enabling enterprise clients to integrate Crushed Studios into their production pipelines.

**Deliverables:**
- API documentation portal (auto-generated from OpenAPI spec)
- API key management: generate, revoke, scope per key
- Core endpoints:
  - Script-to-video: submit screenplay JSON, receive generated video URL
  - Continuity validation: submit scene state, receive validation results
  - Asset management: CRUD on characters, locations, wardrobes
  - Generation status: poll or webhook for completion
- Webhook configuration for generation completion, validation results, review status changes
- API usage metering and per-request billing
- Rate limiting per tier
- SDK stubs (TypeScript, Python)

**Estimated lines:** ~500 new lines
**Cumulative:** ~15,200 lines

---

### Build 5.4 — Performance & Production Hardening
**What:** The final pass before enterprise GA. Performance optimization, error resilience, and operational readiness.

**Deliverables:**
- Code splitting and lazy loading per view (Screenplay, Console, Timeline, Review each load independently)
- Bundle optimization: tree-shaking, dynamic imports for heavy components (waveform editor, video player, timeline)
- Service worker for offline capability (cache static assets, queue operations)
- Comprehensive error boundaries at view, feature, and component levels with fallback UIs
- Sentry/error tracking integration
- Performance monitoring (Core Web Vitals, custom metrics for generation latency)
- Accessibility audit and remediation: ARIA labels, keyboard navigation, focus management, screen reader testing, prefers-reduced-motion
- Responsive layout: fluid max-width for widescreen, tablet breakpoints for review meetings
- E2E test suite for critical paths (Playwright)
- Load testing for concurrent users
- Security audit: XSS prevention, CSRF tokens, content security policy

**Estimated lines:** ~600 new lines
**Cumulative:** ~15,800 lines

---

## Build Summary

| Phase | Builds | Purpose | Lines Added | Running Total |
|-------|--------|---------|-------------|---------------|
| 0 — Moat Visibility | 0.1–0.4 | Surface competitive advantages + extract architecture | ~900 | ~2,900 |
| 1 — Core Pipeline | 1.1–1.5 | Close the script-to-finished-video loop | ~3,700 | ~6,600 |
| 2 — Enterprise Foundation | 2.1–2.5 | Auth, teams, RBAC, approvals, versioning | ~3,000 | ~9,600 |
| 3 — Assets & Intelligence | 3.1–3.5 | Asset reuse, real AI integration, LoRA training | ~2,700 | ~12,300 |
| 4 — Distribution | 4.1–4.3 | Export, publish, analytics | ~1,600 | ~13,900 |
| 5 — Monetization & Hardening | 5.1–5.4 | Credits, billing, API, production readiness | ~1,900 | ~15,800 |

---

## PRD Alignment

| PRD Layer | PRD Section | Build Coverage |
|-----------|-------------|---------------|
| Layer 0 — Existing Foundation | §2.1–2.4 | Already built (v6.0 JSX) |
| Layer 1 — Core Creative Pipeline | §3.1 Storyboard | Already built (Build 0.1 enhances) |
| Layer 1 — Core Creative Pipeline | §3.2 Video Review | Build 1.2 |
| Layer 1 — Core Creative Pipeline | §3.3 Audio | Build 1.3 |
| Layer 1 — Core Creative Pipeline | §3.4 Timeline/NLE | Build 1.4 |
| Layer 2 — Collaboration (Enterprise) | §4.1 Multi-User | Builds 2.1–2.3 |
| Layer 2 — Collaboration (Enterprise) | §4.2 Review Workflows | Build 2.4 |
| Layer 2 — Collaboration (Enterprise) | §4.3 Dashboard | Build 2.2 |
| Layer 2 — Collaboration (Enterprise) | §4.4 Version Control | Build 2.5 |
| Layer 3 — Asset Management | §5.1 Asset Library | Build 3.1 |
| Layer 3 — Asset Management | §5.2 Templates | Build 3.2 |
| Layer 3 — Asset Management | §5.3 Brand Kit | Build 3.3 |
| Layer 4 — AI Intelligence | §6.1–6.3 Agent Architecture | Builds 3.4, 3.5 |
| Layer 5 — Distribution | §7.1–7.3 Export/Publish/Analytics | Builds 4.1–4.3 |
| Layer 6 — Monetization | §8.1–8.4 Credits/Billing/API | Builds 5.1–5.3 |
| — Competitive Moats | (Gap analysis) | Builds 0.1–0.3 |
| — Production Readiness | (Gap analysis) | Builds 0.4, 1.1, 1.5, 5.4 |

---

## Revenue Milestone Alignment (from PRD §9.3)

| Phase | PRD Milestone | Target MRR | Pricing Tiers Active |
|-------|--------------|-----------|---------------------|
| After Phase 1 | Phase 2 — Creative Pipeline (Months 4–6) | $12,800 | Free + Creator ($29) + Pro ($149) |
| After Phase 2 | Phase 3 — Collaboration (Months 7–9) | $39,500 | + Studio ($499) |
| After Phase 3 | Phase 4 — Enterprise (Months 10–14) | $108,000 | + Enterprise ($1,499) |
| After Phase 5 | Phase 5 — Distribution (Months 15–18) | $254,000 ($3M ARR) | All tiers + API access |

---

## Architectural Decisions Locked In

1. **Component extraction happens at Build 0.4** — after moat features are built but before Phase 1. This is the inflection point where monolith cost exceeds extraction cost.

2. **API contract layer ships at Build 1.1** — typed interfaces + mock adapters before any Phase 1 feature. This decouples frontend from backend and enables parallel development.

3. **Real API integration deferred to Build 3.4** — mock adapters carry through Phases 0–2. The frontend is complete and battle-tested before real model APIs are connected, reducing integration risk.

4. **Persistence before enterprise** — Build 1.5 adds localStorage/JSON save before Phase 2 adds server-side auth. Users don't lose work during the single-user phase.

5. **Hardening is last, not first** — Build 5.4 (perf, a11y, security, testing) comes after all features are built. This avoids optimizing code that will change and lets accessibility be designed holistically across the complete UI.

---

*Crushed Studios · Build Trajectory v1.0 · March 2026*
