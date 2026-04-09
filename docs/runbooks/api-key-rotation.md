# API Key Rotation Runbook

## Overview

Schedule: Quarterly (every 90 days)  
Last Rotation: [Date]  
Next Rotation: [Date + 90 days]

## Secrets to Rotate

1. **OpenAI API Key** (OPENAI_API_KEY)
2. **Anthropic API Key** (ANTHROPIC_API_KEY)
3. **Replicate API Key** (REPLICATE_API_KEY)
4. **Stripe API Key** (STRIPE_API_KEY)
5. **AWS Secret Access Key** (AWS_SECRET_ACCESS_KEY)
6. **Database Passwords** (POSTGRES, NEO4J)
7. **Redis Password** (REDIS_PASSWORD)
8. **JWT Secret** (NEXTAUTH_SECRET)

## Rotation Process

### Step 1: Generate New Keys

For each provider:
1. Log into provider console
2. Generate new API key / secret
3. Copy to temporary secure location (1Password, Vault)
4. **Do not** activate yet

### Step 2: Update AWS Secrets Manager

```bash
# List current secrets
aws secretsmanager list-secrets \
  --filters Key=name,Values=production

# Update each secret
aws secretsmanager update-secret \
  --secret-id production/openai-api-key \
  --secret-string "sk-new-key-here"

# Verify update
aws secretsmanager get-secret-value \
  --secret-id production/openai-api-key
```

### Step 3: Deploy Updated Code (if needed)

If environment variables changed:
```bash
git checkout -b chore/rotate-secrets-$(date +%Y%m%d)
# Update .env.example if new variables added
git commit -am "chore: rotate secrets"
git push origin chore/rotate-secrets-$(date +%Y%m%d)
# Open PR and merge
```

### Step 4: Restart Services

```bash
# Restart API service to load new secrets
aws ecs update-service \
  --cluster crushed-studios-production \
  --service crushed-studios-api \
  --force-new-deployment

# Restart worker to load new secrets
aws ecs update-service \
  --cluster crushed-studios-production \
  --service worker \
  --force-new-deployment

# Wait for health checks to pass
sleep 120
aws ecs describe-services \
  --cluster crushed-studios-production \
  --services crushed-studios-api worker \
  --query 'services[*].{Name:serviceName, Status:status}'
```

### Step 5: Verify Functionality

```bash
# Test API calls with new credentials
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Check error logs for key rejection
aws logs tail /ecs/crushed-studios-api --follow --since 5m | grep -i auth

# Run smoke tests
pnpm test:smoke
```

### Step 6: Revoke Old Keys

1. Log into provider console
2. Disable old API key
3. Confirm no errors in logs
4. After 24 hours with no issues: **delete** old key

### Step 7: Document Rotation

1. Update this runbook with rotation date
2. Post in #operations Slack channel:
   ```
   ✅ Secrets rotated
   - OpenAI ✓
   - Anthropic ✓
   - Replicate ✓
   - Stripe ✓
   - AWS ✓
   - Database ✓
   ```
3. Create calendar reminder for next rotation (90 days)

## Emergency Key Revocation

If key is compromised:

1. **Immediately** revoke key in provider console
2. Generate new key
3. Update secret in AWS
4. Restart all services (follow Step 4-5)
5. Monitor for unauthorized usage
6. File security incident report

## Quarterly Checklist

- [ ] Generate new OpenAI key
- [ ] Generate new Anthropic key
- [ ] Generate new Replicate key
- [ ] Generate new Stripe key
- [ ] Rotate AWS credentials
- [ ] Rotate database passwords
- [ ] Rotate Redis password
- [ ] Rotate JWT secret (if needed)
- [ ] Update secrets in AWS Secrets Manager
- [ ] Restart services
- [ ] Verify functionality
- [ ] Revoke old keys
- [ ] Document completion
- [ ] Schedule next rotation

---

**Last Completed:** [Date]  
**Next Scheduled:** [Date]  
**Completed By:** [Name]
