# Contributing to Crushed Studios

## Branch Strategy

- `main` — Production-ready code. Protected branch, requires PR review.
- `develop` — Integration branch for features in progress.
- `feature/*` — Feature branches (e.g., `feature/build-3.1-asset-library`)
- `fix/*` — Bug fix branches
- `docs/*` — Documentation-only changes

## Build Naming Convention

Each build follows the trajectory in `docs/build-trajectory.md`:

```
Phase {N} / Build {N.X} — {Feature Name}
```

Branch names should match: `feature/build-{N.X}-{kebab-case-name}`

## Commit Messages

Use conventional commits:

```
feat(console): add prompt assembly preview panel
fix(continuity): correct carry-forward diff for deleted characters
docs: update phase 2 QA report
refactor: extract shared components from monolith
```

## Current Architecture Note

The codebase is currently a single-file JSX monolith (`src/App.jsx`) with region markers. The `src/` subdirectories contain placeholder files mapping to the planned extraction at Build 0.4. Until extraction is complete, all changes go into `App.jsx` with appropriate region comments.

## Code Style

- React functional components with hooks (no class components)
- Inline styles using the `T` design token object
- All state via `useState` / `useCallback` (Context API planned post-extraction)
- Descriptive component names matching the file map in `docs/file-maps/`
