# Crushed Studios - AI Video Generation Platform

## Product Overview

Crushed Studios is an AI-powered platform for creating professional cinematic video content. The product combines screenplay generation, storyboarding, character management, and video assembly into a unified production suite.

**Core Value Proposition:** Enable creators to produce broadcast-quality video content 10x faster using AI-assisted screenwriting, visual planning, and automated generation.

## Architecture Overview

### Turborepo Monorepo Structure

```
crushed-studios/
├── apps/
│   ├── web/          # Next.js frontend (React 18, App Router)
│   ├── api/          # Fastify backend (TypeScript)
│   └── worker/       # BullMQ worker for GPU jobs
├── packages/
│   ├── @cs/db        # Prisma + Neo4j database layer
│   ├── @cs/ai        # AI service integrations (OpenAI, Anthropic, Replicate)
│   ├── @cs/types     # Shared TypeScript types
│   ├── @cs/constants # Shared constants
│   ├── @cs/utils     # Utility functions
│   └── @cs/tokens    # Design tokens
├── infra/
│   ├── terraform/    # AWS infrastructure as code
│   └── docker/       # Container definitions
├── .claude/          # Claude Code settings and skills
├── .github/          # GitHub workflows and CODEOWNERS
├── tools/            # Development scripts and prompts
└── docs/             # Architecture documentation
```

## 7-Agent Production Pipeline

The platform coordinates AI workloads across 7 specialized agents:

1. **Screenplay Agent** - Generates and refines scripts using Claude API
2. **Storyboard Agent** - Creates visual scene descriptions and camera directions
3. **Character Agent** - Generates character models and visual consistency rules
4. **Continuity Agent** - Enforces visual and narrative consistency across scenes
5. **Video Generation Agent** - Orchestrates video synthesis via Replicate/Stable Video
6. **Audio Agent** - Generates or synthesizes speech and ambient audio
7. **Review Agent** - Validates output quality and flags issues for human review

Each agent has isolated business logic in `apps/api/src/services/` with job processors in `apps/worker/src/processors/`.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router, Server Components)
- React 18 with TypeScript
- Zustand for state management
- TanStack Query for data fetching
- Tailwind CSS + custom CSS variables
- NextAuth for authentication

**Backend:**
- Fastify 4 with TypeScript
- PostgreSQL (primary data store)
- Neo4j (relationship/continuity graph)
- Redis (job queue via BullMQ)
- Prisma ORM

**ML/AI:**
- OpenAI API (screenplay generation)
- Anthropic Claude API (creative direction)
- Replicate (video generation models)
- Custom LoRA fine-tuning pipeline

**Infrastructure:**
- AWS (ECS, RDS, S3, CloudFront)
- Terraform for IaC
- Docker + Docker Compose for local dev
- BullMQ for async job processing
- NVIDIA GPU cluster for training/inference

## Code Style Rules

### TypeScript
- Strict mode enabled (`strict: true`)
- Use explicit types, avoid `any`
- Export named functions and types
- Use interfaces for public APIs

### React Components
- Functional components only
- Use `'use client'` directive for client-side interactivity
- Component file names PascalCase
- Co-locate styles near components
- Storybook stories for complex components

### API Routes
- RESTful conventions: GET (list/read), POST (create), PUT (replace), PATCH (update), DELETE (remove)
- Request validation with Zod schemas
- Error responses follow RFC 7807 problem details format
- Rate limiting via `@fastify/rate-limit`

### Database
- Prisma for PostgreSQL queries
- Neo4j Cypher for relationship queries
- Migrations tracked in `packages/@cs/db/migrations/`
- Seed scripts in `tools/scripts/seed-database.ts`

## Security Requirements

### Authentication & Authorization
- NextAuth with JWT sessions
- Row-Level Security (RLS) in PostgreSQL for multi-tenant isolation
- Identity anchor chain for cross-service correlation
- API key rotation every 90 days

### Data Protection
- All sensitive data encrypted at rest (AES-256)
- TLS 1.3 for all network traffic
- Secrets managed in AWS Secrets Manager
- No secrets in environment files or code

### Compliance
- GDPR-compliant data handling
- Audit trails for all production changes
- Regular security scanning via GitHub Advanced Security
- Incident response runbook in `docs/runbooks/incident-response.md`

## Competitive Moats

1. **Integrated Production Suite** - Complete workflow from script → storyboard → video (not point solutions)
2. **Continuity Tracking** - Graph-based continuity system prevents logical inconsistencies
3. **Fine-Tuned Models** - Custom LoRA models trained on creator's style
4. **Rapid Iteration** - Direct feedback loop enables 10x faster creative cycles
5. **Progressive Self-Hosting** - Gradual shift from SaaS to self-hosted (keep IP local)

## What NOT to Do

- ❌ Don't hardcode secrets in code or config files
- ❌ Don't skip database migrations for schema changes
- ❌ Don't merge PR without passing CI/CD pipeline
- ❌ Don't add dependencies without security audit
- ❌ Don't modify authentication logic without security review
- ❌ Don't assume user input is safe; always validate with Zod
- ❌ Don't create public S3 buckets or open security groups
- ❌ Don't commit `.env.local` files
- ❌ Don't use floating versions for critical dependencies

## Development Workflow

1. **Create feature branch** from `develop`
2. **Implement changes** following code style rules
3. **Run local tests**: `pnpm test`
4. **Run type check**: `pnpm type-check`
5. **Run linter**: `pnpm lint`
6. **Create PR** with detailed description
7. **Wait for CI/CD** (lint, type-check, test, security scan)
8. **Get code review** approval
9. **Merge to develop**, then merge `develop` → `main` for releases

## Key Files

- `turbo.json` - Turborepo configuration and task pipeline
- `tsconfig.base.json` - Root TypeScript configuration
- `pnpm-workspace.yaml` - Monorepo workspaces
- `apps/web/next.config.ts` - Next.js configuration
- `apps/api/src/server.ts` - Fastify server setup
- `infra/terraform/environments/*/main.tf` - Infrastructure definitions
- `.github/workflows/ci.yml` - CI/CD pipeline
- `docs/architecture/decisions/` - Architecture Decision Records (ADRs)

## Getting Started

See `tools/scripts/setup-dev.sh` for environment setup.
See `docs/` for detailed runbooks and architectural decisions.
