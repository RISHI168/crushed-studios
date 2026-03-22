# Crushed Studios — Static & Low-Level Test Report
## Build v6.0 · 2,864 lines · March 2026

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL (runtime crash) | 3 | Fixing now |
| HIGH (dead code / unused) | 5 | Fixing now |
| MEDIUM (data safety) | 3 | Fixing now |
| LOW (style / perf notes) | 4 | Documented for Build 0.4 |

---

## CRITICAL — Will Crash at Runtime

### C1. `rejectPanel` called but never defined
**Lines:** 1730, 2763
**Impact:** Clicking "Reject" on any storyboard panel throws ReferenceError.
**Root cause:** Function was referenced in the UI during storyboard build but the definition was never added. The existing `approvePanel` toggles approved state but there's no separate reject function.
**Fix:** Add `rejectPanel` function that sets `approved: false` and marks the panel for redo.

### C2. `addPanelAfter` called but defined as `addPanel`
**Line called:** 1754
**Line defined:** 808 (as `addPanel`)
**Impact:** Clicking "Insert After" on any storyboard panel throws ReferenceError.
**Root cause:** Function name mismatch between definition (`addPanel`) and UI call (`addPanelAfter`).
**Additional issue:** Call passes `(sceneId, panel.id)` but function expects `(sceneId, afterIdx)` — passing panel ID where an index is expected.
**Fix:** Rename function and fix parameter handling to find index from panelId.

### C3. `reorderPanel` called but defined as `movePanel`
**Lines called:** 1749, 1759
**Line defined:** 836 (as `movePanel`)
**Impact:** Clicking "Move ←" or "Move →" throws ReferenceError.
**Additional issue:** Call passes `(sceneId, panel.id, direction)` but function expects `(sceneId, fromIdx, direction)` — panel ID vs index mismatch.
**Fix:** Rename function and fix to look up index from panelId.

---

## HIGH — Dead Code / Unused Declarations

### H1. `editingCharId` / `setEditingCharId` — declared, never used
**Line:** 537
**Fix:** Remove declaration.

### H2. `sbRegenPanel` / `setSbRegenPanel` — declared, never used
**Line:** 543
**Fix:** Remove declaration.

### H3. `setChars` — declared, never called
**Line:** 531
**Impact:** Characters cannot be edited at runtime. The Character Bible tab displays character data but has no edit functionality wired.
**Fix:** Keep for Build 0.4 (character editing will need this). Document as intentionally unused.

### H4. `scrollFilmstrip` — defined, never called
**Line:** 896
**Fix:** Remove (filmstrip already has native horizontal scroll).

### H5. `movePanel` / `addPanel` — defined but called by wrong names
**Lines:** 808, 836
**Fix:** Covered by C2 and C3 fixes (rename to match call sites).

---

## MEDIUM — Data Safety Concerns

### M1. 21 risky property chains without optional chaining
**Pattern:** `s.storyboard.panels` accessed without `?.` in storyboard panel functions.
**Risk:** If storyboard is null/undefined (which it is for scenes without generated storyboards), accessing `.panels` will crash.
**Scope:** Most of these are inside functions that only run after a guard check, but 4 are in `getStoryboardStats` and `getCarryForward` which are called globally.
**Fix:** Add null guards at function entry points.

### M2. `generateVideo` has 8 state updates across nested timeouts
**Risk:** React may batch some updates but setTimeout callbacks run outside React's batching. Multiple rapid re-renders possible.
**Impact:** Visual flicker during generation animation. Not a crash, but janky.
**Fix for Build 0.4:** Consolidate agent feed updates using functional state pattern.

### M3. z-index values span 0–9999 without a documented scale
**Registry:** 0 (swim-lane nodes), 2 (swim-lane edges), 100 (sticky header), 200 (storyboard overlay), 9999 (tooltip).
**Risk:** Future components may conflict.
**Fix for Build 0.4:** Define z-index scale in design tokens.

---

## LOW — Style & Performance Notes (Build 0.4)

### L1. 26 inline arrow functions in onClick handlers
**Impact:** Each creates a new function reference per render. Not a problem at current component count but becomes a perf issue after component extraction with React.memo.

### L2. 8 hardcoded hex colors outside the design token system
**Impact:** Theme inconsistency if dark mode variants or brand refresh needed. Acceptable for now.

### L3. @keyframes defined inside JSX render body
**Lines:** 1633, 1643, 2246
**Impact:** Re-injected into DOM on every render. Should be extracted to the `<style>` block.

### L4. Missing `boxSizing: "border-box"` on one input element
**Impact:** Minor layout overflow in edge cases.

---
