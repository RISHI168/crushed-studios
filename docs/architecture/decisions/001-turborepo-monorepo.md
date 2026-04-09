# ADR 001: Turborepo Monorepo Architecture

**Status:** Accepted  
**Date:** 2026-04-09  
**Deciders:** Rishi, Tech Lead

## Context

Crushed Studios requires a scalable architecture for:
- Shared code (types, utilities, design tokens)
- Multiple applications (web, API, worker)
- Fast builds and deployments
- Clear ownership and separation of concerns

Options considered:
1. **Monorepo** (Turborepo, Lerna, Yarn Workspaces) - Single repo, multiple packages
2. **Polyrepo** (Multiple GitHub repos) - Complete separation, harder to share code
3. **Monolith** (Single app) - No separation, tight coupling

## Decision

We chose **Turborepo monorepo** because:

### Advantages
- **Code Sharing:** Shared packages (`@cs/types`, `@cs/utils`, `@cs/tokens`) reduce duplication
- **Atomic Changes:** Update API, frontend, and database schema in single PR
- **Build Optimization:** Turborepo's caching prevents redundant builds
- **Developer Experience:** Single `pnpm install`, consistent tooling
- **Incremental Migration:** Extract monolith gradually into modular packages

### Structure
```
apps/
  web/            # Next.js frontend
  api/            # Fastify backend
  worker/         # GPU job processor

packages/
  @cs/db/         # Prisma + Neo4j models
  @cs/ai/         # AI service clients
  @cs/types/      # Shared TypeScript types
  @cs/constants/  # Shared constants
  @cs/utils/      # Utility functions
  @cs/tokens/     # Design tokens
```

## Consequences

### Positive
- Reduced code duplication across apps
- Simpler dependency management
- Faster feedback loops during development
- Clear boundaries via package isolation
- Easier to extract microservices later

### Negative
- Single git repo (no per-app access control)
- All apps must use same TypeScript version
- Build failures in one package affect others
- Requires discipline on boundaries

## Alternatives Rejected

### Polyrepo
- Would duplicate types, constants, utils across repos
- Harder to coordinate breaking changes
- More complex CI/CD orchestration

### Monolith
- Would prevent component reuse across web/api
- Harder to scale and deploy independently
- Limits progressive migration from current structure

## Implementation Notes

- Use Turborepo for task orchestration and caching
- Use pnpm workspaces for dependency management
- Enforce import boundaries via TypeScript paths and ESLint
- Plan migration of monolith into modular packages
- Regular audit of package dependencies to prevent circular imports

## References

- Turborepo: https://turbo.build
- pnpm: https://pnpm.io
- Related: ADR 002 (Modular Monolith vs Microservices)
