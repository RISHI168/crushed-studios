# Crushed Studios — Production File Extraction Map
## From: `crushed-studios-storyboard.jsx` (2,869 lines, single-file artifact)
## To: `/src/` multi-file production architecture
### Build 0.4 · March 2026

---

## Architecture Overview

```
src/
├── tokens.js                          # Design system tokens, fonts, colors
├── constants/
│   ├── scene.js                       # Scene status, beat types, transitions
│   ├── character.js                    # Physical attrs, mannerisms, emotions, wardrobe
│   ├── production.js                   # Camera, lighting, lens, film stock, bible options
│   ├── storyboard.js                  # Panel compositions, border states, content types
│   └── agents.js                      # Prompt layers, agent roster
├── data/
│   └── seed.js                        # initBible, initChars, initScenes, initScreenplay
├── utils/
│   ├── validation.js                  # validateScene, validateAllScenes
│   └── intelligence.js                # assemblePrompt, getCarryForward, getPanelStatus
├── hooks/
│   ├── useProjectState.js             # All useState declarations, derived values
│   ├── useSceneActions.js             # Scene CRUD, character-in-scene mutations
│   ├── useStoryboard.js               # Panel CRUD, generate, approve, reject, reorder
│   └── useGeneration.js               # generateVideo, agent feed staging
├── components/
│   ├── shared/
│   │   ├── Tip.jsx                    # Hover tooltip
│   │   ├── SH.jsx                     # Section header (icon + title + tip + right action)
│   │   ├── VBadge.jsx                 # Validation badge (green/red dot)
│   │   ├── StatusBadge.jsx            # Scene status pill
│   │   ├── TagSelect.jsx              # Single-select tag buttons
│   │   └── MultiTag.jsx               # Multi-select tag buttons
│   ├── screenplay/
│   │   ├── ScriptPreview.jsx          # Formatted screenplay renderer
│   │   ├── StatusPipeline.jsx         # Interactive status advancement
│   │   └── EmotionArc.jsx             # Cinematic tension curve SVG
│   ├── console/
│   │   ├── StoryboardGenerator.jsx    # Filmstrip + generation UI
│   │   ├── StoryboardOverlay.jsx      # Full-screen expanded panel view
│   │   ├── ContinuityContext.jsx      # Carry-forward analysis panel
│   │   ├── PromptAssembly.jsx         # 6-layer prompt preview
│   │   └── AgentActivityFeed.jsx      # Generation agent timeline
│   └── layout/
│       ├── AppShell.jsx               # Header, footer, view routing
│       ├── SceneTimeline.jsx          # Horizontal scene navigator
│       └── ViewTabs.jsx               # Tab bar component
├── views/
│   ├── ScreenplayView.jsx             # Full screenplay editor
│   ├── ConsoleView.jsx                # Scene production console
│   ├── CharactersView.jsx             # Character Bible
│   └── ContinuityView.jsx            # Continuity tracker + scene graph
├── styles/
│   └── responsive.css                 # CSS custom properties, breakpoints, grid classes
└── App.jsx                            # Root component, state provider, view router
```

**File count:** 34 files
**Average file size:** ~84 lines (2,869 ÷ 34)

---

## Region-to-File Mapping

### REGION 1: Design System → `/src/tokens.js`
**Current lines:** 10–22 (13 lines)

```
EXPORTS:
  T           — Color token object {DARK, CARD, BORDER, INPUT, IBORDER, TXT, DIM, GOLD, GD, CYAN, RED, GREEN, PURPLE, PINK, ORANGE, BLUE, LIME, TEAL}
  M           — Mono font stack: "'Space Mono',monospace"
  D           — Display font stack: "'Bodoni Moda','Instrument Serif',serif"
  B           — Body font stack: "'Outfit','DM Sans',sans-serif"
  ACCENT      — Gold gradient: "linear-gradient(135deg,#F59E0B,#D97706)"
  CHAR_COLORS — Array of 8 character accent colors

IMPORTED BY: Every file in the project
```

### REGION 2: Domain Constants → `/src/constants/*.js`

**`/src/constants/scene.js`** (Lines 24–36, ~13 lines)
```
EXPORTS: SCENE_STATUS, STATUS_FLOW, BEAT_TYPES, TRANSITION_TYPES, SCENE_HEADINGS
IMPORTED BY: StatusPipeline, StatusBadge, ScreenplayView, seed.js
```

**`/src/constants/character.js`** (Lines 38–64, ~27 lines)
```
EXPORTS: PHYSICAL_ATTRS, MANNERISMS, WARDROBE_ITEMS, EMOTIONS_LIST, emotionIntensity
IMPORTED BY: ConsoleView, CharactersView, ContinuityView, EmotionArc, intelligence.js
```

**`/src/constants/production.js`** (Lines 65–92, ~28 lines)
```
EXPORTS: SHOT_TYPES, CAMERA_MOVEMENTS, LIGHTING_SOURCES, ATMOSPHERES, CAMERA_BODIES,
         FOCAL_LENGTHS, LENS_TYPES, FILM_STOCKS, ASPECT_RATIOS, GENRES, ERAS, COLOR_GRADES
IMPORTED BY: ConsoleView (TagSelect options), useSceneActions (surpriseMe)
```

**`/src/constants/storyboard.js`** (Lines 93–108, ~16 lines)
```
EXPORTS: PANEL_COMPOSITIONS, PANEL_CONTENT_TYPES, PANEL_BORDER_STATES, SB_COLORS, getPanelStatus
IMPORTED BY: StoryboardGenerator, StoryboardOverlay, useStoryboard
```

**`/src/constants/agents.js`** (Lines 111–131, ~21 lines)
```
EXPORTS: PROMPT_LAYERS, AGENT_ROSTER
IMPORTED BY: PromptAssembly, AgentActivityFeed, useGeneration
```

### REGION 3: Seed Data → `/src/data/seed.js`
**Current lines:** 132–249 (118 lines)

```
EXPORTS: initBible(), initChars(), initScenes(), initScreenplay()
IMPORTS: T (tokens), SCENE_STATUS
IMPORTED BY: useProjectState (initial useState values)

NOTE: In production, seed data is replaced by API responses.
These factories become test fixtures and demo mode data.
```

### REGION 4: Shared Components → `/src/components/shared/*.jsx`

**`Tip.jsx`** (Lines 250–263, ~14 lines)
```
PROPS: { text: string }
IMPORTS: tokens (M, B)
STATE: show, pos (local useState)
USED IN: SH, ScreenplayView, ConsoleView
```

**`SH.jsx`** (Lines 265–275, ~11 lines)
```
PROPS: { n?, icon, title, tip?, right? }
IMPORTS: tokens (T, M, D, GOLD), Tip
USED IN: Every view
```

**`VBadge.jsx`** (Lines 277–282, ~6 lines)
```
PROPS: { ok: boolean, issues: number }
IMPORTS: tokens (T, M, GREEN, RED)
USED IN: SceneTimeline
```

**`StatusBadge.jsx`** (Lines 284–291, ~8 lines)
```
PROPS: { status: string }
IMPORTS: tokens (M), SCENE_STATUS
USED IN: SceneTimeline, ScreenplayView
```

**`TagSelect.jsx`** (Lines 293–308, ~16 lines)
```
PROPS: { label, value, options, onChange, color? }
IMPORTS: tokens (T, M, B, GOLD)
USED IN: ConsoleView (cinematography, Production Bible)
```

**`MultiTag.jsx`** (Lines 310–329, ~20 lines)
```
PROPS: { label, value[], options, onChange, color?, max? }
IMPORTS: tokens (T, M, B, CYAN)
USED IN: ConsoleView (mannerism overrides)
```

### REGION 4b: Domain Components → `/src/components/screenplay/*.jsx`

**`EmotionArc.jsx`** (Lines 331–418, ~88 lines)
```
PROPS: { charId, scenes, color }
IMPORTS: tokens (T, M, B, DARK), emotionIntensity
USED IN: CharactersView, ContinuityView
NOTE: Heaviest shared component — contains SVG generation with gradients, filters, bezier paths
```

**`ScriptPreview.jsx`** (Lines 419–446, ~28 lines)
```
PROPS: { scene, chars, compact? }
IMPORTS: tokens (T, M, BORDER)
USED IN: ScreenplayView (full preview), ConsoleView (locked script preview)
```

**`StatusPipeline.jsx`** (Lines 447–486, ~40 lines)
```
PROPS: { status, onAdvance, onRevert }
IMPORTS: tokens (T, M), SCENE_STATUS, STATUS_FLOW
USED IN: ScreenplayView
```

### REGION 5: Validation Logic → `/src/utils/validation.js`
**Current lines:** 487–525 (39 lines)

```
EXPORTS: validateScene(scene, scenes, chars, bible), validateAllScenes(scenes, chars, bible)
IMPORTS: emotionIntensity, MANNERISMS
IMPORTED BY: useProjectState (useEffect), ContinuityView

PURE FUNCTIONS: Yes — no side effects, no state dependencies.
Can be unit tested in isolation.
```

### REGION 10: Intelligence Utils → `/src/utils/intelligence.js`
**Current lines:** 906–1119 (214 lines)

```
EXPORTS:
  getStoryboardStats(scene)       — {total, approved, allApproved}
  getCarryForward(scene, scenes, chars)  — {charDiffs[], constraintCount, flags, scenePosition}
  assemblePrompt(scene, chars, scenes, bible) — {layers[], totalTokens, constraintCount}

IMPORTS: emotionIntensity, PANEL_COMPOSITIONS, T

NOTE: getCarryForward and assemblePrompt currently close over component state
(scenes, chars). During extraction, they must receive these as parameters.
The artifact version uses closure; the production version uses explicit args.

PURE FUNCTIONS: getStoryboardStats and assemblePrompt are pure.
getCarryForward needs scenes/chars passed in (currently reads from closure).

TESTING: These are the highest-value unit test targets.
  - assemblePrompt: test each layer composition with known scene data
  - getCarryForward: test emotion diffs, wardrobe changes, first-appearance handling
  - getStoryboardStats: test empty/partial/full approval states
```

### REGION 6–9: Custom Hooks → `/src/hooks/*.js`

**`useProjectState.js`** (Lines 527–570)
```
EXPORTS: { bible, setBible, chars, setChars, scenes, setScenes, screenplay, setScreenplay,
           activeSceneId, setActiveSceneId, view, setView, expandedChar, setExpandedChar,
           spEditScene, setSpEditScene, spShowPreview, setSpShowPreview,
           activeScene, activeIdx, activeStoryboard, sbTotalCount, sbApprovedCount, sbAllApproved,
           totalIssues, lockedCount, ok }

STATE COUNT: 17 useState + 5 derived values
EFFECTS: boot animation (ok), validation (validateAllScenes)
```

**`useSceneActions.js`** (Lines 576–658)
```
EXPORTS: { addScene, updateScene, updateSceneCamera, updateSceneScreenplay,
           updateSceneStatus, toggleCharInScene, updateCharInScene, surpriseMe }

DEPENDS ON: scenes, setScenes, chars, screenplay, setScreenplay
IMPORTED BY: ScreenplayView, ConsoleView
```

**`useStoryboard.js`** (Lines 659–905)
```
EXPORTS: { generateStoryboard, approvePanel, rejectPanel, regeneratePanel,
           deletePanel, addPanelAfter, reorderPanel,
           sbExpandedPanel, setSbExpandedPanel, sbGuidance, setSbGuidance, sbGenerating }

STATE: sbExpandedPanel, sbGuidance, sbGenerating
DEPENDS ON: scenes, setScenes, chars
IMPORTED BY: ConsoleView, StoryboardOverlay
```

**`useGeneration.js`** (Lines 858–905)
```
EXPORTS: { generateVideo, agentFeed, videoGenerating, genLog, setGenLog }

STATE: agentFeed, videoGenerating, genLog
DEPENDS ON: scenes, setScenes, chars, bible, assemblePrompt, getCarryForward, getStoryboardStats
IMPORTED BY: ConsoleView (AgentActivityFeed)
```

### REGION 11: Responsive CSS → `/src/styles/responsive.css`
**Current lines:** 1128–1195 (68 lines)

```
Extract the entire <style>{`...`}</style> block to a standalone CSS file.
Import in App.jsx: import './styles/responsive.css'

CSS CUSTOM PROPERTIES:
  --cs-pad, --cs-main-max, --cs-grid-cols-2/3/4, --cs-overlay-cols

CLASSES:
  .cs-header, .cs-main, .cs-g2, .cs-g3, .cs-g4,
  .cs-overlay-split, .cs-timeline, .cs-filmstrip-card, .cs-tech-badges

KEYFRAMES:
  @keyframes sbspin, sbpulse, afspin

BREAKPOINTS:
  ≤640px (mobile), ≤860px (badge hide), ≤1024px (tablet), ≥1200px (desktop)
```

### REGION 12: Layout Shell → `/src/components/layout/AppShell.jsx`
**Current lines:** 1120–1127 (render open), 1196–1266 (header + tabs), 2860–2869 (footer)

```
CONTAINS: <div> root, Google Fonts <link>, ambient glow, header, tab bar, scene timeline
IMPORTS: tokens, VBadge, StatusBadge, getStoryboardStats
PROPS: Receives all state from useProjectState + hooks

This becomes the layout wrapper that renders the active view:
  <AppShell>
    {view === "screenplay" && <ScreenplayView />}
    {view === "console" && <ConsoleView />}
    {view === "characters" && <CharactersView />}
    {view === "continuity" && <ContinuityView />}
  </AppShell>
```

**`SceneTimeline.jsx`** (Lines 1267–1299, ~33 lines)
```
PROPS: { scenes, chars, activeSceneId, setActiveSceneId, setSpEditScene, addScene, getStoryboardStats }
IMPORTS: tokens, StatusBadge, VBadge, Tip
```

**`ViewTabs.jsx`** (Lines 1237–1266, ~30 lines)
```
PROPS: { view, setView }
IMPORTS: tokens
```

### REGION 13: View: Screenplay → `/src/views/ScreenplayView.jsx`
**Current lines:** 1300–1547 (248 lines)

```
IMPORTS:
  Tokens: T, M, D, B
  Components: SH, Tip, StatusBadge, ScriptPreview, StatusPipeline
  Constants: BEAT_TYPES, TRANSITION_TYPES, SCENE_HEADINGS, SCENE_STATUS
  Hooks: useSceneActions (updateSceneScreenplay, updateSceneStatus, updateScene)
  State: screenplay, scenes, chars, spEditScene, spShowPreview, activeSceneId

SECTIONS:
  - Project meta (title, logline, synopsis)
  - Act structure (3 acts with scene cards)
  - Scene editor (heading, slugline, action, dialogue blocks, beat, transition, duration, notes)
  - Script preview toggle
  - AI Script Intelligence panel (placeholder scores)
  - Generation Readiness panel
```

### REGION 14: View: Console → `/src/views/ConsoleView.jsx`
**Current lines:** 1548–2327 (780 lines — LARGEST)

```
IMPORTS:
  Tokens: T, M, D, B, ACCENT
  Components: SH, Tip, TagSelect, MultiTag, ScriptPreview
  Console Components: StoryboardGenerator, ContinuityContext, PromptAssembly, AgentActivityFeed
  Constants: EMOTIONS_LIST, emotionIntensity, SHOT_TYPES, CAMERA_MOVEMENTS, LIGHTING_SOURCES,
             ATMOSPHERES, GENRES, ERAS, COLOR_GRADES, CAMERA_BODIES, LENS_TYPES, FILM_STOCKS,
             ASPECT_RATIOS, FOCAL_LENGTHS, MANNERISMS, PROMPT_LAYERS, AGENT_ROSTER
  Hooks: useSceneActions, useStoryboard, useGeneration
  Utils: assemblePrompt, getCarryForward

INTERNAL SUBSECTIONS (candidates for further splitting):
  L1548–1570:  Lock gate + issue bar              → inline (small)
  L1574–1580:  Locked script preview               → inline (uses ScriptPreview)
  L1582–1620:  Storyboard section                  → StoryboardGenerator.jsx
  L1625–1700:  Scene details + cinematography      → inline
  L1700–1808:  Characters in scene                 → CharacterInScene.jsx (future)
  L1808–1825:  Production Bible                    → inline
  L1828–1970:  Continuity Engine Context            → ContinuityContext.jsx
  L1970–2210:  Prompt Assembly Preview              → PromptAssembly.jsx
  L2210–2327:  Agent Activity Feed + Generate btn   → AgentActivityFeed.jsx

NOTE: At 780 lines, ConsoleView is the prime candidate for sub-component extraction.
The three moat panels (Continuity, Prompt Assembly, Agent Feed) account for ~480 lines
and are self-contained — they take scene/chars/bible as props and return JSX.
Extracting just these three drops ConsoleView to ~300 lines.
```

### REGION 15: View: Characters → `/src/views/CharactersView.jsx`
**Current lines:** 2328–2402 (75 lines)

```
IMPORTS: tokens, SH, EmotionArc, PHYSICAL_ATTRS, EMOTIONS_LIST
STATE: expandedChar
```

### REGION 16: View: Continuity → `/src/views/ContinuityView.jsx`
**Current lines:** 2403–2654 (252 lines)

```
IMPORTS: tokens, SH, EmotionArc, emotionIntensity
STATE: activeSceneId (for scene graph click navigation)

SUBSECTIONS:
  - Stats cards (4 metrics)
  - Emotion Arcs (per-character)
  - Scene Graph (swim-lane visualization) — could be its own component
  - Validation Matrix (table)
  - Camera Continuity (table)
  - Validation Pipeline (step list)
```

### REGION 17: Storyboard Overlay → `/src/components/console/StoryboardOverlay.jsx`
**Current lines:** 2655–2859 (205 lines)

```
IMPORTS: tokens, getPanelStatus, PANEL_BORDER_STATES
FUNCTIONS USED: approvePanel, rejectPanel, regeneratePanel, deletePanel
STATE: sbExpandedPanel (controls visibility), sbGuidance

NOTE: This is a fixed-position full-screen overlay (z-index: 200).
In production, this becomes a portal component.
```

### REGION 18: Footer → `/src/components/layout/Footer.jsx`
**Current lines:** 2860–2869 (10 lines)

```
IMPORTS: tokens (T, M, ACCENT)
Static component — no state, no props.
```

---

## Dependency Graph (Simplified)

```
tokens.js ←── every file
     │
constants/*.js ←── views, hooks, utils
     │
data/seed.js ←── useProjectState.js
     │
utils/validation.js ←── useProjectState.js (effect)
utils/intelligence.js ←── ConsoleView, useGeneration
     │
hooks/useProjectState.js ──→ provides state to all views
hooks/useSceneActions.js ──→ ScreenplayView, ConsoleView
hooks/useStoryboard.js ──→ ConsoleView, StoryboardOverlay
hooks/useGeneration.js ──→ ConsoleView (AgentActivityFeed)
     │
components/shared/*.jsx ←── all views
components/screenplay/*.jsx ←── ScreenplayView, ConsoleView, CharactersView, ContinuityView
components/console/*.jsx ←── ConsoleView only
components/layout/*.jsx ←── App.jsx
     │
views/*.jsx ──→ rendered by App.jsx based on view state
```

---

## Extraction Priority Order

When moving to a real build system, extract in this order (each step is independently shippable):

| Step | What | Files | Risk | Why this order |
|------|------|-------|------|----------------|
| 1 | Tokens + constants | 7 files | Zero | Pure data, no logic, no dependencies |
| 2 | Shared components | 6 files | Low | Pure presentational, easy to test |
| 3 | Utils | 2 files | Low | Pure functions, highest unit-test value |
| 4 | Custom hooks | 4 files | Medium | State management — test with React Testing Library |
| 5 | Domain components | 3 files | Low | EmotionArc, ScriptPreview, StatusPipeline |
| 6 | Console sub-components | 5 files | Medium | ContinuityContext, PromptAssembly, AgentFeed, Storyboard* |
| 7 | Views | 4 files | High | Largest files, most integration points |
| 8 | Layout + App shell | 4 files | Medium | Wiring — do last when all parts exist |

---

## Z-Index Scale (standardized for production)

| Layer | z-index | Component |
|-------|---------|-----------|
| Base content | 0 | Swim-lane nodes, inline content |
| Elevated content | 1 | Swim-lane node labels (above edges) |
| Swim-lane edges | 2 | Connection lines in scene graph |
| Sticky header | 100 | AppShell header bar |
| Modal overlay | 200 | StoryboardOverlay |
| Tooltips | 9999 | Tip component |

---

## State Architecture Recommendation (for production)

The current 17 useState variables should migrate to a layered state architecture:

| State Category | Current | Production Target |
|----------------|---------|-------------------|
| Server state (scenes, chars, bible, screenplay) | useState | React Query / TanStack Query with API sync |
| UI state (view, expandedChar, paOpen, ccOpen) | useState | Zustand store (persists across renders) |
| Ephemeral state (sbGuidance, agentFeed) | useState | Local useState (stays in component) |
| Derived state (activeScene, sbAllApproved, etc.) | inline const | useMemo with dependency arrays |
| URL state (view, activeSceneId) | useState | Next.js searchParams or useRouter |

This migration happens during Build 1.1 (API Contract Layer) — the extraction map above is designed so the hook boundaries align with these state categories.

---

## Google Fonts Link (for production `<head>`)

```html
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;0,6..96,800;1,6..96,400;1,6..96,700&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

---

*Crushed Studios · File Extraction Map v1.0 · March 2026*
