# Legacy Monolith Migration

This directory contains the original monolith `App.jsx` during the incremental migration to modular Next.js components.

## Migration Strategy

The legacy App.jsx is rendered through Next.js while components are progressively extracted into modular, reusable React components in `/components`. As each component is extracted, the corresponding code in App.jsx should be removed.

## Regions Reference

- **Region 1**: Global state providers and layout
- **Region 2**: Authentication flows
- **Region 3**: Project management
- **Region 4**: UI utilities and shared components
- **Region 5**: Screenplay editing interface
- **Region 6**: AI Console and generation controls
- **Region 7**: Character and continuity management
- **Region 8**: Video review and timeline assembly
- **Region 9**: Audio mixing and effects
- **Region 10**: Settings and account management

## Progress Tracking

Track extraction progress in the related GitHub issue. Each PR should include:
- Which region was extracted
- How many lines removed from App.jsx
- Link to component stubs or full implementations
- Test coverage
