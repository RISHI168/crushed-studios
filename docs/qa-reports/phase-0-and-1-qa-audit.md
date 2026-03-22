# Crushed Studios v6.0 — QA Audit Playbook
## For automated and manual review via Claude Cowork
### Target file: `crushed-studios-storyboard.jsx` (4,271 lines, single-file React artifact)

---

## How to Use This Document

Hand this file to Claude Cowork alongside `crushed-studios-storyboard.jsx`. Ask it to execute each checkpoint sequentially and report findings in the format specified under each section. Checkpoints are ordered by priority — Checkpoint 4 (Static Audit) can run fully automated; the others require simulated walk-through reasoning.

---

## Checkpoint 1 — Cold Start Integrity

**Goal:** Verify the first-time user experience loads correctly with seed data and no prior state.

### Tests

| ID | Test | Expected Result | Severity |
|----|------|----------------|----------|
| CS-1.1 | Boot animation fires (`ok` state, 60ms delay) | Fade-in with translateY transition | Medium |
| CS-1.2 | Seed data loads: `initBible()`, `initChars()`, `initScenes()`, `initScreenplay()` | 3 scenes, 3 characters, 3-act structure, bible with all fields populated | Critical |
| CS-1.3 | Google Fonts `<link>` tag present with Bodoni Moda, Outfit, Space Mono, Courier Prime | All 4 font families load | High |
| CS-1.4 | View tabs show only Screenplay, Console, Characters, Continuity on fresh load | Review and Timeline tabs hidden (no generated scenes) | High |
| CS-1.5 | Scene timeline renders 3 scenes with correct numbers, titles, status badges | S1=generated, S2=reviewed, S3=draft | High |
| CS-1.6 | `window.storage.get("crushed-project")` fails gracefully on first visit | Falls back to seed data, no error thrown | Critical |
| CS-1.7 | Color tokens `T.*` all resolve to valid hex strings | No undefined or NaN in inline styles | Critical |
| CS-1.8 | Design tokens `M`, `D`, `B` resolve to quoted font stacks | fontFamily values are valid CSS | High |

### Report Format
```
CS-1.1: PASS/FAIL — [observation]
CS-1.2: PASS/FAIL — [observation]
...
```

---

## Checkpoint 2 — Full Pipeline End-to-End

**Goal:** Walk through the entire screenplay-to-timeline golden path. Every feature is touched in sequence. This is the investor demo flow.

### Pre-conditions
- Start from seed data (Scene 1 has `status: "generated"` and a demo take)
- All state variables at initial values

### Test Steps

| ID | View | Action | Expected Result | Severity |
|----|------|--------|----------------|----------|
| E2E-1 | Screenplay | Verify 3-act structure renders with scene cards per act | Acts render with scene IDs mapped correctly | Critical |
| E2E-2 | Screenplay | Verify Scene 1 editor shows: heading, slugline, action, 2 dialogue blocks, transition, beat, duration, notes | All fields populated from seed data | Critical |
| E2E-3 | Screenplay | Verify ScriptPreview component renders formatted screenplay | Courier Prime font, character names uppercase, parentheticals italic | High |
| E2E-4 | Screenplay | Verify StatusPipeline shows correct status for Scene 1 | Status = "generated", pipeline shows progression | High |
| E2E-5 | Console | Navigate to Console, verify Scene 1 is active | Console loads with Scene 1 data | Critical |
| E2E-6 | Console | Verify lock gate: Scene 1 (generated) should show locked script preview | ScriptPreview renders in read-only mode | High |
| E2E-7 | Console | Verify §1 Scene Details: shot type, movement, lighting, atmosphere populated | TagSelect components show correct values from `scene.camera` | High |
| E2E-8 | Console | Verify §2 Characters In Scene: Meera and Arjun listed with emotion, dialogue, blocking | Character cards render with correct data from `scene.chars` | High |
| E2E-9 | Console | Verify "Surprise Me" randomizes camera and character emotions | `surpriseMe()` fires, scene state updates, no crash | Medium |
| E2E-10 | Console | Verify §3 Storyboard Generator section exists | Section renders (may show "Generate Storyboard" or existing panels) | High |
| E2E-11 | Console | Click "Generate Storyboard" (if no panels exist) | `sbGenerating` set, 1.8s delay, panels appear, notification toast fires | Critical |
| E2E-12 | Console | Approve all storyboard panels one by one | `panel.approved` toggles true, approval count updates in header | Critical |
| E2E-13 | Console | Open expanded panel overlay (click a panel) | Full-screen overlay renders with split view, panel details, action buttons | High |
| E2E-14 | Console | Reject a panel, add guidance text, regenerate | Panel regenerates with new composition after 1.5s delay | High |
| E2E-15 | Console | Verify §4 Production Bible: genre, era, color grade, film stock, etc. | TagSelect components populated from `bible` state | Medium |
| E2E-16 | Console | Verify §5 Continuity Engine Context panel | Collapsed: character diff chips. Expandable: per-character cards with emotion diff, wardrobe, mannerisms | High |
| E2E-17 | Console | Expand Prompt Assembly Preview (§5) | 6 layers render with expandable detail, token bar, "Prompt Constraint Framework v2" badge | High |
| E2E-18 | Console | Verify token count in Prompt Assembly updates based on scene data | `assemblePrompt()` returns correct `totalTokens` | Medium |
| E2E-19 | Console | Verify all panels approved → Generate Scene button enabled | Button text shows "Generate Scene N →" (not locked/disabled message) | Critical |
| E2E-20 | Console | Click "Generate Scene" | `videoGenerating` set, Agent Activity Feed shows 7 agents firing sequentially (400ms–6500ms stagger) | Critical |
| E2E-21 | Console | Wait for generation to complete (8.2s) | Notification toast: "Scene N generated — X tokens, Y constraints, 7 agents". Auto-navigates to Review view. | Critical |
| E2E-22 | Console | Verify scene now has a `take` record in `scene.takes[]` | Take has: id, timestamp, duration, resolution, tokens, constraints, agentLog, validation, annotations, approved=false | Critical |
| E2E-23 | Review | Verify Review Interface loads with correct scene | Scene selector shows the generated scene, latest take active | Critical |
| E2E-24 | Review | Drag playhead scrubber 0→100 | Timecode updates, storyboard panel tracking follows, no crash | High |
| E2E-25 | Review | Switch to Storyboard Comparison sub-tab | Panel reference vs. generated frame renders, filmstrip at bottom | High |
| E2E-26 | Review | Switch to Validation sub-tab | 8 checks render with pass/fail indicators, generation metadata block | High |
| E2E-27 | Review | Switch to Script Sync sub-tab | Action text and dialogue blocks render, active block highlights based on playhead | High |
| E2E-28 | Review | Add an annotation via text input + Enter key | Annotation appears in list with timecode, orange dot on scrubber | High |
| E2E-29 | Review | Resolve the annotation | Status toggles to resolved (green), text gets strikethrough | Medium |
| E2E-30 | Review | Click "Approve Take" | Take marked approved, green badge appears, notification fires | High |
| E2E-31 | Console | Navigate back to Console, scroll to Audio section | Audio & Sound Design section visible (§6) with 4 tracks for generated scene | Critical |
| E2E-32 | Console | Click "Generate All Tracks" in Audio section | 4 tracks generate with 800ms stagger, waveforms appear, notification per track | High |
| E2E-33 | Console | Mute dialogue track | Waveform dims to 20% opacity, 🔇 badge shows | Medium |
| E2E-34 | Console | Add guidance to score track, click "Regen with note" | Track regenerates, notification confirms guidance was applied | Medium |
| E2E-35 | Timeline | Navigate to Timeline / NLE tab | Timeline loads with generated scene(s) as filmstrip clips, audio waveforms on tracks | Critical |
| E2E-36 | Timeline | Verify filmstrip segments on video clip (not audio waveform bars) | Bottom of video clip shows alternating panel segments, not random-height bars | High |
| E2E-37 | Timeline | Click video clip → Clip Inspector opens | Shows scene details, transition, color grade, audio track count | High |
| E2E-38 | Timeline | Click M on MUS track | Score track row dims to 20% opacity, M button turns red | Medium |
| E2E-39 | Timeline | Click S on DIA track | All non-DIA tracks dim, S button turns gold | Medium |
| E2E-40 | Timeline | Verify empty scene clips show dashed outlines on audio tracks | Scenes without audio show ⊘ icon, "click to generate" hint | Medium |
| E2E-41 | Timeline | Verify playhead spans full height (all tracks) | Gold line with circle head from ruler to bottom of TEXT track | Medium |
| E2E-42 | Timeline | Click "Export Film →" | Notification confirms export with duration and quality | Medium |
| E2E-43 | Header | Click "📁 Project" → "Export Project" | `.crushed.json` file downloads with all project data | High |
| E2E-44 | Header | Verify auto-save indicator | Save dot shows gold "Saving…" after edit, then green "Saved" | High |
| E2E-45 | — | Simulate page refresh (check `window.storage` persistence) | Project reloads from saved state, not seed data | Critical |

### Report Format
```
E2E-1: PASS/FAIL — [observation]
E2E-2: PASS/FAIL — [observation]
...
Summary: X/45 passed, Y failed, Z could not be tested (requires runtime)
```

---

## Checkpoint 3 — Edge Case Stress Test

**Goal:** Attempt to break the app by triggering unusual states, rapid actions, data overflow, and error paths.

### Tests

| ID | Category | Test | Expected Result | Severity |
|----|----------|------|----------------|----------|
| EC-1 | Empty state | Add Scene 4 (empty), navigate to Console | All sections render without crash. Empty state messages where appropriate. | Critical |
| EC-2 | Empty state | Navigate to Continuity tab with empty Scene 4 active | Emotion Arcs, Scene Graph, Validation Matrix handle zero-character scene | High |
| EC-3 | Empty state | Navigate to Characters tab with no characters in a scene | Character Bible still renders all 3 characters | Medium |
| EC-4 | Rapid action | Click "Generate Storyboard" twice rapidly | Should not create duplicate storyboard. `sbGenerating` gate should block second click. | Critical |
| EC-5 | Rapid action | Click "Generate Scene" during active storyboard generation | Generate button should show disabled state, not fire both | Critical |
| EC-6 | Rapid action | Navigate away from Console during video generation (8.2s timeout) | Timeout callbacks should not crash when component state has changed | Critical |
| EC-7 | Data overflow | Set Scene 1 action text to 2000+ characters | ScriptPreview renders without layout break. Prompt Assembly token count spikes. | High |
| EC-8 | Data overflow | Add 20+ dialogue blocks to a scene | Console character section handles long list. assemblePrompt handles all blocks. | Medium |
| EC-9 | Data overflow | Add 10 annotations at same playhead position in Review | Annotation list renders all 10, scrolls if needed, counter shows "10 open" | Medium |
| EC-10 | Concurrent | Generate audio for all 4 tracks simultaneously | All 4 `generating` states coexist, all 4 complete without overwriting each other | High |
| EC-11 | Permission | Audio section hidden for non-generated scenes | `activeScene.status === "generated"` gate prevents render | High |
| EC-12 | Permission | Review tab hidden when no scenes have takes | Tab bar `.concat()` condition excludes Review | High |
| EC-13 | Permission | Timeline tab hidden when no scenes are generated | Tab bar `.concat()` condition excludes Timeline | High |
| EC-14 | Import | Import a valid `.crushed.json` file | All state hydrated, notification shows scene/character count | High |
| EC-15 | Import | Import a random JSON file (e.g., `{"foo": "bar"}`) | Error notification: "Invalid project file — missing bible, chars, scenes, or screenplay." | High |
| EC-16 | Import | Import a non-JSON file (e.g., `.txt`) | `JSON.parse` fails, error notification fires, app doesn't crash | High |
| EC-17 | Reset | Click "Reset to Demo Data" during video generation | In-flight timeouts complete but write to stale scene IDs. Verify no crash. | Critical |
| EC-18 | Reset | Click "Reset to Demo Data" → Confirm → Verify state | All state returns to seed data. Saved storage cleared. View returns to Screenplay. | High |
| EC-19 | Persistence | Edit scene → wait 2s → check `window.storage` | Storage contains updated scene data with `_meta.savedAt` timestamp | High |
| EC-20 | Persistence | Delete storage externally → reload | App falls back to seed data gracefully | Medium |
| EC-21 | Null safety | Call `getCarryForward(null)` | Returns default object `{charDiffs:[], constraintCount:0, flags:0, scenePosition:"—"}` | High |
| EC-22 | Null safety | Call `getStoryboardStats(undefined)` | Returns `{total:0, approved:0, allApproved:false}` | High |
| EC-23 | Null safety | Scene with no `screenplay` property navigates to Console | No crash on `scene.screenplay?.action`, `scene.screenplay?.dialogueBlocks`, etc. | High |
| EC-24 | Null safety | Scene with no `storyboard` property → approve/reject/delete panel | Guarded by `!s.storyboard?.panels` — no-op, no crash | Critical |
| EC-25 | Null safety | Scene with no `audio` property → Audio section | Lazy init: `const audio = activeScene.audio || { tracks: [...], masterVolume: 85 }` | High |

### Report Format
```
EC-1: PASS/FAIL — [observation]
EC-2: PASS/FAIL — [observation]
...
Summary: X/25 passed, Y failed, Z requires runtime
```

---

## Checkpoint 4 — Static Code Audit

**Goal:** Automated verification of code health, structural integrity, and architectural compliance. This checkpoint can be run entirely by static analysis.

### Tests

| ID | Check | Method | Pass Criteria |
|----|-------|--------|--------------|
| SA-1 | Bracket balance | Count `{}`, `()`, `[]` pairs | All three pairs equal |
| SA-2 | Critical function definitions | Grep for 21 critical function names | All 21 defined in code |
| SA-3 | State variable health | Parse all `useState` declarations, count getter/setter usage | 0 dead state variables (getter=1 AND setter=1) |
| SA-4 | Stale references | Search for known removed identifiers | 0 matches for: JetBrains, editingCharId, sbRegenPanel, scrollFilmstrip, filmstripRef, movePanel |
| SA-5 | Null guard coverage | Check 6 storyboard mutation functions | All 6 contain `storyboard?.panels` guard |
| SA-6 | Inline keyframes | Count `<style>{\`@keyframes` patterns | 0 — all keyframes in central CSS block |
| SA-7 | Region markers | Count lines containing "REGION" | ≥ 18 markers |
| SA-8 | Export default | Check for `export default` | Present |
| SA-9 | View definitions | Count `view === "X"` for all 6 views | screenplay(1), console(1), characters(1), continuity(1), review(1), timeline(1) |
| SA-10 | Persistence: storage API | Check for `window.storage.get`, `.set`, `.delete` | All 3 present |
| SA-11 | Persistence: no localStorage | Search for `localStorage` and `sessionStorage` | 0 matches |
| SA-12 | MockAPI completeness | Check for 5 method definitions | generateStoryboard, generateVideo, generateAudio, analyzeScript, exportVideo |
| SA-13 | API error types | Count typed error definitions in `API_ERRORS` | ≥ 6 |
| SA-14 | Design token coverage | Search for hardcoded hex colors outside `T.*` or known constants | Flag any found (low severity) |
| SA-15 | Component prop flow | Verify no `undefined` function calls in JSX onClick/onChange handlers | All referenced functions exist in scope |

### Automated Script
```javascript
// Run this in Node.js with the JSX file path as input
// See the existing test script pattern used throughout the build session
```

### Report Format
```
SA-1: PASS/FAIL — {3289/3289} (1248/1248) [328/328]
SA-2: PASS/FAIL — 21/21 critical functions defined
...
Summary: X/15 passed, Y failed
```

---

## Checkpoint 5 — Product Demo Readiness

**Goal:** Evaluate the 3-minute investor demo flow for cohesion, clarity, and dead spots. This is a subjective assessment.

### Demo Script (3 minutes)

| Timestamp | Action | What to Say | Risk to Watch |
|-----------|--------|-------------|---------------|
| 0:00–0:20 | Open Screenplay tab | "This is Crushed Studios. I wrote a 3-scene noir screenplay." | Font rendering, act structure layout |
| 0:20–0:40 | Click Console tab | "This is the Production Console — 230+ parameters orchestrated by specialized AI agents." | Scene load time, section ordering |
| 0:40–1:00 | Generate Storyboard → Approve panels | "Watch: I generate a storyboard from the screenplay. Each panel is a visual reference for the AI." | 1.8s generation delay — fill with narration |
| 1:00–1:30 | Click Generate Scene | "Now 7 specialized agents assemble a generation prompt — scriptwriter, continuity, cinematography, storyboard, prompt assembly, generation engine, validation." | 8.2s wait — Agent Activity Feed must be visually engaging enough |
| 1:30–1:50 | Review Interface | "Automatic QA: LoRA similarity, wardrobe match, blocking accuracy, temporal continuity — 8 checks." | Auto-navigate must be smooth |
| 1:50–2:10 | Audio section | "4-track audio mix: dialogue TTS, AI score, environmental ambience, sound effects." | Waveform rendering speed |
| 2:10–2:35 | Timeline tab | "This is the NLE. Filmstrip clips, 4 audio tracks, transition markers, mute/solo — full post-production." | Must look like a real NLE, not a toy |
| 2:35–3:00 | Export + Save indicator | "Auto-saved. Export as a project file or render the final film." | Export button must fire notification |

### Evaluation Criteria

| Criterion | Score (1–5) | Notes |
|-----------|-------------|-------|
| First-impression clarity (can you tell what this product does in 10s?) | | |
| Visual cohesion (does it feel like one product or stitched features?) | | |
| Pipeline flow (does screenplay→timeline feel like a natural progression?) | | |
| Feature density impression (does it feel powerful without feeling cluttered?) | | |
| Competitive differentiation (does it look different from Runway/Pika/etc?) | | |
| Enterprise readiness signals (does it feel like a $500/mo tool?) | | |

---

## Appendix A — Architecture Reference

### State Tree (39 variables)

| Category | Variables | Persistence |
|----------|-----------|-------------|
| Project data (4) | bible, chars, scenes, screenplay | ✅ Auto-saved |
| Navigation (3) | activeSceneId, view, spEditScene | ❌ Session only |
| UI panels (5) | expandedChar, spShowPreview, paExpanded, paOpen, ccOpen | ❌ Session only |
| Storyboard (3) | sbExpandedPanel, sbGuidance, sbGenerating | ❌ Session only |
| Generation (4) | agentFeed, videoGenerating, genLog, notification | ❌ Session only |
| Review (7) | reviewSceneId, reviewTab, playhead, playSpeed, isPlaying, frameNotes, noteInput | ❌ Session only |
| Timeline (7) | tlZoom, tlPlayhead, tlPlaying, tlSelectedClip, tlRenderQuality, tlOverlays, tlTrackMutes/Solos | ❌ Session only |
| System (3) | ok, saveStatus, showProjectMenu | ❌ Session only |

### View Registry

| View ID | Tab Label | Conditional Visibility | Line Range (approx) |
|---------|-----------|----------------------|---------------------|
| screenplay | Screenplay | Always | 1497–1670 |
| console | Scene Console | Always | 1745–2730 |
| characters | Character Bible | Always | 2733–2808 |
| continuity | Continuity Tracker | Always | 2808–2850 |
| review | Review Interface | `scenes.some(s => s.takes?.length > 0)` | 3065–3475 |
| timeline | Timeline / NLE | `scenes.some(s => s.status === "generated")` | 3530–3810 |

### File Extraction Map
See `crushed-studios-file-map.md` for the full 34-file production architecture.

---

## Appendix B — Known Deferred Issues

| ID | Issue | Severity | Deferred To |
|----|-------|----------|-------------|
| D-1 | `generateVideo` has 8 state updates across nested timeouts — potential stale closure | Medium | Phase 2 |
| D-2 | z-index values (0, 1, 2, 10, 100, 200, 9998, 9999) not in a token constant | Low | Phase 2 |
| D-3 | 26 inline arrow onClick handlers (re-create on every render) | Low | Phase 2 |
| D-4 | 8 hardcoded hex colors outside token system | Low | Phase 2 |
| D-5 | `setChars` setter declared but never called (intentionally reserved for character editing) | Info | Phase 2 |
| D-6 | Storyboard panel composition values are randomized — no deterministic mapping to screenplay content | Medium | Build 3.4 |
| D-7 | Audio waveforms are random data — no mapping to actual audio characteristics | Medium | Build 3.4 |
| D-8 | Take validation scores are partially randomized — blocking/continuity checks use `Math.random()` | Medium | Build 3.4 |

---

*Crushed Studios · QA Audit Playbook v1.0 · March 2026*
