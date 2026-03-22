# File Intake Guide — Crushed Studios Repo

When a new file is uploaded or pointed to, use this guide to determine where it belongs in the repository and what filename it should be given.

## How to Use This Guide

1. Identify the file type using the detection rules below
2. Follow the routing instructions for that type
3. Apply the naming convention
4. Suggest the git commit message

---

## File Type Detection

### Codebase Version (new build of the monolith)
**How to recognize:** JSX file, large (100KB+), filename contains "Phase" and "Build" and a version number, imports React, contains region markers like `REGION 1: Design System`.

**Route:**
- Move the current `src/App.jsx` to `deprecated/` using the format below
- Place the new file as `src/App.jsx`

**Deprecated filename:**
```
deprecated/phase-{N}/build-{N.X}-{feature-name-kebab-case}.jsx
```

**Example:**
```
Uploaded:  "Phase 3 _ Build 3.1 _ Asset Library.jsx"
Action:    mv src/App.jsx → deprecated/phase-2/build-2.5-version-control.jsx
           mv uploaded   → src/App.jsx
Commit:    feat: build 3.1 — asset library
```

---

### QA Audit Report
**How to recognize:** Markdown file, contains "Checkpoint Report" or "QA" or "audit" in filename/content, has tables with metrics like "Lines", "State variables", "Brackets: Balanced".

**Route:**
```
docs/qa-reports/phase-{N}-qa-audit.md
```

If it covers a specific build rather than a full phase:
```
docs/qa-reports/build-{N.X}-qa-audit.md
```

**Example:**
```
Uploaded:  "crushed-studios-qa-audit _phase 3.md"
Action:    → docs/qa-reports/phase-3-qa-audit.md
Commit:    docs: add phase 3 QA audit report
```

---

### File Extraction Map
**How to recognize:** Markdown file, contains "File Extraction Map" or "file-map" in filename, has tables mapping regions/components to `/src/` file paths.

**Route:**
```
docs/file-maps/phase-{N}-extraction-map.md
```

If it updates an existing phase map, overwrite the previous version.

**Example:**
```
Uploaded:  "crushed-studios-file-map_phase 3_Production File Extraction Map.md"
Action:    → docs/file-maps/phase-3-extraction-map.md
Commit:    docs: add phase 3 extraction map
```

---

### Test Report
**How to recognize:** Markdown file, contains "test_report" or "test report" in filename, has sections like "Static Analysis", "Runtime Tests", pass/fail results.

**Route:**
```
docs/qa-reports/build-{N.X}-test-report.md
```

**Example:**
```
Uploaded:  "crushed-studios_testing_post build 3.1 _ static_and_low level_test_report.md"
Action:    → docs/qa-reports/build-3.1-test-report.md
Commit:    docs: add build 3.1 test report
```

---

### Build Trajectory Update
**How to recognize:** Markdown file, contains "Build Trajectory" in title, has the full phase/build roadmap with line estimates and cumulative totals.

**Route:** Overwrite the existing file:
```
docs/build-trajectory.md
```

**Example:**
```
Uploaded:  "crushed-studios-build-trajectory.md" (updated version)
Action:    → docs/build-trajectory.md (overwrite)
Commit:    docs: update build trajectory to v{X}
```

---

### Architecture Diagram / Mockup
**How to recognize:** SVG, HTML, or PNG file related to system design, UI mockups, or architecture visualization.

**Route:**
```
docs/architecture/{descriptive-kebab-case-name}.{ext}
```

**Example:**
```
Uploaded:  "continuity_engine_flow.svg"
Action:    → docs/architecture/continuity-engine-flow.svg
Commit:    docs: add continuity engine architecture diagram
```

---

### PRD or Product Spec
**How to recognize:** Markdown or PDF, contains "PRD" or "Product Requirements" or structured sections with layer/feature specs.

**Route:**
```
docs/prd-{version-or-descriptor}.md
```

**Example:**
```
Uploaded:  "Crushed Studios PRD v2.md"
Action:    → docs/prd-v2.md
Commit:    docs: add PRD v2
```

---

## Naming Rules (Universal)

| Rule | Example |
|------|---------|
| Always kebab-case | `build-3.1-asset-library.jsx` not `Build 3.1 Asset Library.jsx` |
| No spaces or underscores as separators | `phase-3-qa-audit.md` not `phase 3_qa audit.md` |
| Phase number in name | `phase-3-extraction-map.md` |
| Build number when specific to a build | `build-3.1-test-report.md` |
| Lowercase everything | `continuity-engine-flow.svg` not `Continuity_Engine_Flow.svg` |

## When Unsure

If an uploaded file doesn't clearly match any category above, ask:

1. **Is it documentation?** → `docs/` with a descriptive subfolder if needed
2. **Is it source code?** → Check if it replaces `src/App.jsx` or belongs in a specific `src/` subdirectory
3. **Is it a reference/asset?** → `docs/architecture/` or `public/`
4. **Is it historical/superseded?** → `deprecated/` with phase subfolder
