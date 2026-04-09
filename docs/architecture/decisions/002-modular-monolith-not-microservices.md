# ADR 002: Modular Monolith, Not Microservices

**Status:** Accepted  
**Date:** 2026-04-09

## Context

As Crushed Studios grows, there's pressure to scale components independently. However, the typical microservices journey creates operational complexity:

- Service discovery and networking
- Distributed tracing and debugging
- Database synchronization (eventual consistency)
- Deployment coordination
- Increased latency from inter-service calls

## Decision

Remain a **modular monolith** with clear package boundaries, deployable as a single unit. Separate GPU workers via separate process (not microservice).

## Architecture

```
Single Production Deployment:
├── Web (Next.js) → Served by single App Load Balancer
├── API (Fastify) → Colocated with web
└── Database (PostgreSQL + Neo4j)

Separate GPU Worker:
└── Worker (BullMQ) → Separate process on GPU-equipped machines
    └── Consumes jobs from shared Redis
```

## Rationale

### Monolith Advantages
- **Simpler Operations:** Single deployment, consistent logs
- **Direct Calls:** No network latency between web and API
- **Database Transactions:** ACID guarantees across services
- **Debugging:** Stack traces show full request flow
- **Cost:** No inter-service communication overhead

### Worker Separation
- **GPU Isolation:** GPU jobs don't block API requests
- **Independent Scaling:** Run workers on GPU machines only
- **Job Queue:** Decoupled via BullMQ + Redis (not RPC)

## When to Reconsider

Split to microservices only when:
1. API uptime > 99.99% (SLA requirements)
2. Different scaling profiles (API vs Worker at 10x ratio)
3. Team > 50+ engineers (Conway's Law)
4. Database schema conflicts across domains
5. Actual operational complexity outweighs benefits

**Current status:** Not applicable. Monitor but stay monolith.

## Progressive Path to Microservices

If needed later:
1. **Extract Domains:** Each API domain becomes a service
2. **Async First:** Shift to event-driven via BullMQ
3. **GraphQL Gateway:** API Gateway abstracts service boundaries
4. **Service Registry:** Use service mesh (Istio) for discovery

But we're not there yet. Premature extraction adds complexity without proportional benefit.

## References

- Sam Newman: "Building Microservices" (2015)
- Kelsey Hightower: "Why I'm building a monolith" (2022)
- Related: ADR 001 (Turborepo Monorepo)
