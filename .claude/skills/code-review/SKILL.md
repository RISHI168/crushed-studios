# Code Review Skill

Perform thorough code reviews for Crushed Studios codebase.

## Review Checklist

### Code Quality
- [ ] Code follows TypeScript strict mode rules
- [ ] No hardcoded secrets or API keys
- [ ] Proper error handling with try-catch
- [ ] No console.log in production code (use logger instead)
- [ ] Functions have single responsibility
- [ ] Complex logic has comments explaining "why", not "what"

### Testing
- [ ] Changes have corresponding unit tests
- [ ] Test coverage does not decrease
- [ ] Tests are deterministic and don't depend on timing
- [ ] Edge cases are tested

### Performance
- [ ] Database queries are optimized (no N+1)
- [ ] No unnecessary re-renders in React components
- [ ] Large dependencies are justified
- [ ] Bundle size impact is acceptable

### Security
- [ ] No SQL injection vulnerabilities
- [ ] User input is validated with Zod
- [ ] Authentication/authorization checks are present
- [ ] Sensitive data is not logged
- [ ] CORS is properly configured

### Database
- [ ] Schema changes have migration files
- [ ] Migrations are backwards compatible
- [ ] Prisma types are generated
- [ ] No breaking changes to public APIs

### Documentation
- [ ] Complex functions have JSDoc comments
- [ ] README updated if needed
- [ ] Architecture decisions documented in ADRs
- [ ] Breaking changes are clearly noted

### Deployment
- [ ] CI/CD pipeline passes
- [ ] Environment variables are documented in .env.example
- [ ] Database migrations are included in PR
- [ ] No manual steps required for deployment
