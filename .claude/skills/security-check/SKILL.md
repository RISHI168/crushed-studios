# Security Audit Skill

Perform comprehensive security reviews of Crushed Studios codebase.

## Security Checklist

### Secrets & Credentials
- [ ] No hardcoded API keys or secrets
- [ ] No credentials in git history
- [ ] Secrets stored in AWS Secrets Manager
- [ ] Environment variables documented in .env.example (without values)
- [ ] SSH keys and certificates not committed

### Authentication & Authorization
- [ ] All protected routes validate JWT token
- [ ] Row-level security (RLS) enforced in database
- [ ] Rate limiting prevents brute force attacks
- [ ] Session tokens have appropriate expiration
- [ ] Password hashing uses bcrypt with 12+ rounds

### Database Security
- [ ] All user inputs validated with Zod
- [ ] Prepared statements used (Prisma default)
- [ ] No SQL injection vulnerabilities
- [ ] Sensitive data encrypted at rest
- [ ] Backup encryption enabled

### API Security
- [ ] CORS properly configured (not "*")
- [ ] HTTPS enforced in production
- [ ] Content-Security-Policy headers set
- [ ] X-Frame-Options prevents clickjacking
- [ ] CSRF tokens on state-changing operations

### Cloud Infrastructure
- [ ] S3 buckets not publicly readable
- [ ] Security groups restrict inbound traffic
- [ ] Database not exposed to internet
- [ ] VPC endpoints used for AWS services
- [ ] CloudTrail logging enabled

### Dependencies
- [ ] No known vulnerabilities: `npm audit`
- [ ] License compliance checked
- [ ] Dependency updates reviewed
- [ ] Supply chain risks assessed
- [ ] Lock files committed (pnpm-lock.yaml)

### Logging & Monitoring
- [ ] Sensitive data not logged
- [ ] Error messages don't expose internals
- [ ] Access logs archived
- [ ] CloudWatch alarms configured
- [ ] Incident response plan documented

## Critical Issues

FAIL the review if any of these are present:

1. ❌ Hardcoded credentials in code
2. ❌ SQL injection vulnerabilities
3. ❌ Missing authentication on protected endpoints
4. ❌ Unencrypted sensitive data at rest
5. ❌ Publicly readable S3 buckets or databases
6. ❌ XSS vulnerabilities in frontend
7. ❌ Missing CSRF protection
8. ❌ Unvalidated user input
