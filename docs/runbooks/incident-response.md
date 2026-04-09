# Incident Response Runbook

## Overview

This runbook provides step-by-step procedures for responding to production incidents at Crushed Studios.

## Severity Levels

| Severity | Definition | Response Time | Example |
|----------|-----------|---|---|
| Critical | Production down, users cannot access | < 15 min | API crash, database offline |
| High | Major feature broken for all users | < 1 hour | Generations failing |
| Medium | Feature broken for subset of users | < 4 hours | Specific video format failing |
| Low | Degraded performance or UX issue | < 24 hours | UI slowness, typo |

## On-Call Rotation

- Primary on-call: 1 week rotation
- Secondary on-call: Parallel rotation (escalation)
- Schedule: PagerDuty (link)
- Escalation after 30 min no response

## Critical Incident Response

### Step 1: Declare Incident (First 5 minutes)

1. **Create** incident in PagerDuty with severity level
2. **Notify** on-call team in #incidents Slack channel
3. **Identify** incident commander (most senior available)
4. **Set** incident status page to "Investigating"

### Step 2: Assess Impact (First 10 minutes)

1. Check CloudWatch dashboards
2. Review error logs in CloudWatch Logs
3. Query database query performance
4. Contact customer support for user impact report
5. Post status update to status page

### Step 3: Remediation (Ongoing)

**If API crash:**
```bash
# Check deployment status
aws ecs describe-services --cluster crushed-studios-production --services crushed-studios-api

# Check logs
aws logs tail /ecs/crushed-studios-api --follow

# Rollback if needed
git checkout <previous-good-commit>
git push --force-with-lease origin production

# Re-deploy
# GitHub Actions automatically triggers on production push
```

**If database offline:**
```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier crushed-studios-prod-db

# Check connections
psql -U admin -d crushed_studios_production -c "SELECT count(*) FROM pg_stat_activity;"

# Restart if needed
aws rds reboot-db-instance --db-instance-identifier crushed-studios-prod-db
```

**If Redis queue failure:**
```bash
# Check Redis health
redis-cli -h <redis-endpoint> PING

# Clear stuck jobs
redis-cli -h <redis-endpoint> FLUSHDB

# Restart workers
aws ecs update-service --cluster crushed-studios-production --service worker --force-new-deployment
```

### Step 4: Communication

1. **Update** status page every 30 minutes
2. **Post** incident summary in Slack #incidents
3. **Email** customers if incident > 1 hour
4. **Call** customer success manager if revenue-impacting

### Step 5: Recovery

1. **Verify** system health (all checks passing)
2. **Monitor** error rates for 30 minutes
3. **Close** PagerDuty incident
4. **Schedule** post-mortem within 24 hours

## Database Recovery

See [Database Recovery Runbook](database-recovery.md)

## API Key Rotation

See [API Key Rotation Runbook](api-key-rotation.md)

## Post-Mortem Template

**Incident:** [Name]  
**Date:** [Date and Time (UTC)]  
**Severity:** [Critical/High/Medium/Low]  
**Duration:** [Start - End time]

**Root Cause:** [What actually happened]

**Contributing Factors:** [What made it possible]

**Resolution:** [How we fixed it]

**Action Items:**
- [ ] Item 1
- [ ] Item 2

**Timeline:**
- [Time] Event
- [Time] Event
- [Time] Resolved

## Quick Links

- CloudWatch Dashboard: https://console.aws.amazon.com/cloudwatch
- PagerDuty: https://crushed.pagerduty.com
- Status Page: https://status.crushed.studio
- Slack #incidents: [Link]
- On-Call Schedule: [Link]

---

**Last Updated:** 2026-04-09  
**Next Review:** 2026-07-09
