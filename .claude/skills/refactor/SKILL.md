# Monolith Extraction Refactor Skill

Guide for extracting components from the legacy monolith `src/legacy/App.jsx`.

## Extraction Process

1. **Identify Region** - Choose a region from the legacy App.jsx to extract
   - Regions labeled in comments: Region 1-10
   - Start with Region 4 (UI utilities) for low-risk extraction

2. **Create Component Stub** - Create stub component in `apps/web/src/components/`
   - File: `ComponentName.tsx`
   - Export named React functional component
   - Add `data-component` attribute for tracking
   - Add TODO comment referencing source region

3. **Extract Implementation** - Move code from monolith to component
   - Preserve functionality exactly
   - Update imports to reference new location
   - Remove old code from App.jsx
   - Test with existing data

4. **Add Type Safety** - Convert to TypeScript
   - Define component props interface
   - Generate Zod schemas for prop validation
   - Update tests for new component

5. **Test & Validate** - Ensure extraction is complete
   - Run existing tests
   - Test component in isolation
   - Verify no regressions in monolith
   - Update snapshot tests

## Regions Reference

| Region | Content | Priority | Status |
|--------|---------|----------|--------|
| 1 | Global state & providers | Low | Pending |
| 2 | Authentication flows | High | Pending |
| 3 | Project management | Medium | Pending |
| 4 | UI utilities & shared | Low | Pending |
| 5 | Screenplay editor | High | Pending |
| 6 | AI Console | High | Pending |
| 7 | Characters & continuity | Medium | Pending |
| 8 | Video review & timeline | Medium | Pending |
| 9 | Audio mixing | Low | Pending |
| 10 | Settings & account | Low | Pending |

## Best Practices

- Extract smallest logical unit first
- Keep changes atomic (one region per PR)
- Run full test suite after each extraction
- Update component story in Storybook
- Document breaking changes in CHANGELOG.md
