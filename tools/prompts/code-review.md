# Code Review Prompt

Review the following code changes for quality, security, and correctness:

## Context
- **Project:** Crushed Studios - AI Video Generation Platform
- **Tech Stack:** TypeScript, Next.js, Fastify, PostgreSQL, Neo4j
- **Standards:** See `.claude/CLAUDE.md` for architecture and code style rules

## Review Dimensions

### 1. Code Quality
- Does the code follow TypeScript strict mode?
- Are error handlers appropriate?
- Is the code DRY (Don't Repeat Yourself)?
- Are functions small and focused?
- Are variable names clear and descriptive?

### 2. Architecture
- Does the change follow the monorepo structure?
- Are imports using correct path aliases (@/ for internal, @cs/ for shared)?
- Is the change properly separated by concern?
- Could this be a shared package instead of local code?

### 3. Security
- Are secrets hardcoded anywhere?
- Is user input validated with Zod?
- Are SQL queries using Prisma (no string interpolation)?
- Is sensitive data being logged?
- Are rate limits in place for APIs?

### 4. Performance
- Could this cause N+1 database queries?
- Are React components properly memoized?
- Are unnecessary re-renders prevented?
- Is bundle size impact minimal?

### 5. Testing
- Are tests included for new code?
- Do tests cover happy path and edge cases?
- Are tests deterministic?

### 6. Documentation
- Are JSDoc comments on complex functions?
- Are breaking changes documented?
- Is the CHANGELOG updated?

## Output Format

Provide:
1. **Summary** - 1-2 sentences on overall quality
2. **Strengths** - 2-3 things done well
3. **Issues** - Categorized by severity (Critical/Major/Minor)
4. **Suggestions** - Actionable improvements
5. **Approval** - Approve / Request Changes / Comment
