# Security Review Prompt

Perform a comprehensive security audit of the Crushed Studios codebase.

## Focus Areas

### 1. Authentication & Authorization
- Check NextAuth configuration for JWT vulnerabilities
- Verify all protected routes require authentication
- Confirm rate limiting prevents brute force
- Review session timeout and token expiration

### 2. Data Protection
- Verify encryption at rest for sensitive data
- Check that passwords are hashed with bcrypt (12+ rounds)
- Confirm TLS 1.3 in production
- Review secret management in AWS Secrets Manager

### 3. API Security
- Check CORS configuration (not "*")
- Verify CSRF protection on state-changing ops
- Review rate limiting thresholds
- Confirm input validation with Zod

### 4. Database Security
- Check for SQL injection vulnerabilities
- Verify Row-Level Security (RLS) policies
- Review backup encryption
- Confirm no prod data in tests

### 5. Cloud Infrastructure
- S3 buckets not publicly readable
- Security groups restrict unnecessary ports
- Database not exposed to internet
- CloudTrail logging enabled

### 6. Secrets Management
- No hardcoded API keys or credentials
- Secrets rotated regularly
- Environment variables documented
- Leaked secrets removed from history

### 7. Dependencies
- Run `pnpm audit` for vulnerabilities
- Check licenses for compliance
- Review supply chain risk of new deps
- Keep packages up to date

### 8. Logging & Monitoring
- Sensitive data not logged (passwords, tokens, PII)
- Error messages don't expose internals
- CloudWatch alarms configured
- Incident response plan documented

## Output Format

Provide:
1. **Summary** - Overall security posture
2. **Critical Issues** - Must fix immediately
3. **High-Risk Issues** - Fix before production
4. **Medium-Risk Issues** - Address in sprint
5. **Low-Risk Improvements** - Nice to have
6. **Recommendations** - Strategic improvements

Flag any `CRITICAL` issues that block deployment.
