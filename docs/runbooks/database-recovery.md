# Database Recovery Runbook

## Overview

Procedures for recovering from PostgreSQL and Neo4j incidents.

## PostgreSQL Recovery

### Connection Pool Exhaustion

**Symptoms:** "Too many connections" errors

```bash
# Check current connections
psql -U admin -d crushed_studios_production \
  -c "SELECT count(*) FROM pg_stat_activity;"

# Identify blocked connections
psql -U admin -d crushed_studios_production \
  -c "SELECT pid, usename, query FROM pg_stat_activity WHERE state = 'active';"

# Terminate idle connections
psql -U admin -d crushed_studios_production \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';"

# Restart connection pooling service
aws ecs update-service \
  --cluster crushed-studios-production \
  --service pg-bouncer \
  --force-new-deployment
```

### Disk Space Issues

**Symptoms:** "Disk full" errors, slow queries

```bash
# Check disk usage
aws rds describe-db-instances \
  --db-instance-identifier crushed-studios-prod-db \
  --query 'DBInstances[0].AllocatedStorage'

# Check free space
psql -U admin -d crushed_studios_production \
  -c "SELECT pg_database_size('crushed_studios_production') / 1024 / 1024 / 1024 as size_gb;"

# Clean up old WAL files
psql -U admin -d crushed_studios_production \
  -c "SELECT pg_stat_statements_reset();"

# Expand volume
aws rds modify-db-instance \
  --db-instance-identifier crushed-studios-prod-db \
  --allocated-storage 200 \
  --apply-immediately
```

### Data Corruption

**Symptoms:** Index errors, constraint violations

```bash
# Run consistency check
psql -U admin -d crushed_studios_production \
  -c "REINDEX DATABASE crushed_studios_production;"

# Restore from backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier crushed-studios-prod-db-restored \
  --db-snapshot-identifier <snapshot-id>

# Verify restored database
psql -U admin -d crushed_studios_production \
  -c "SELECT version();"

# If backup is good, promote it:
# 1. Update application connection strings
# 2. Monitor for errors
# 3. Archive old database
```

## Neo4j Recovery

### Memory Issues

**Symptoms:** Query timeouts, "Heap space" errors

```bash
# Check memory usage
curl http://<neo4j-instance>:7474/db/neo4j/stats

# Clear cache
curl -X POST http://admin:password@<neo4j-instance>:7474/db/neo4j/tx \
  -H "Content-Type: application/json" \
  -d '{"statements": [{"statement": "CALL apoc.cypher.mapParallel(\"MATCH (n) RETURN count(n)\", {}) YIELD value RETURN value"}]}'

# Restart Neo4j service
aws ecs update-service \
  --cluster crushed-studios-production \
  --service neo4j \
  --force-new-deployment
```

### Index Corruption

**Symptoms:** Cypher query errors, slow traversals

```bash
# Rebuild indexes
curl -X POST http://admin:password@<neo4j-instance>:7474/db/neo4j/tx \
  -H "Content-Type: application/json" \
  -d '{"statements": [{"statement": "CALL apoc.index.rebuild()"}]}'

# Verify indexes
curl http://admin:password@<neo4j-instance>:7474/db/neo4j/tx \
  -H "Content-Type: application/json" \
  -d '{"statements": [{"statement": "SHOW INDEXES"}]}'
```

## Backup & Restore

### Automated Backups

- PostgreSQL: Daily snapshots, 30-day retention
- Neo4j: Daily export to S3, 14-day retention

### Manual Backup

```bash
# PostgreSQL
aws rds create-db-snapshot \
  --db-instance-identifier crushed-studios-prod-db \
  --db-snapshot-identifier crushed-studios-prod-db-$(date +%Y%m%d-%H%M%S)

# Neo4j
curl -X POST http://admin:password@<neo4j-instance>:7474/db/neo4j/admin/backup \
  -d '{"path": "/backups"}'
```

### Point-in-Time Recovery

```bash
# List available backups
aws rds describe-db-snapshots \
  --db-instance-identifier crushed-studios-prod-db

# Restore to specific point
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier crushed-studios-prod-db \
  --target-db-instance-identifier crushed-studios-prod-db-pit \
  --restore-time 2026-04-09T15:00:00Z
```

## Validation

After recovery:

```bash
# Check data consistency
psql -U admin -d crushed_studios_production << EOF
  SELECT schemaname, tablename, 
         pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
  FROM pg_tables 
  WHERE schemaname = 'public' 
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
EOF

# Check Neo4j graph integrity
curl http://admin:password@<neo4j-instance>:7474/db/neo4j/tx \
  -d '{"statements": [{"statement": "MATCH (n) RETURN count(n) as total_nodes"}]}'

# Run integration tests
pnpm test:e2e
```

---

**Last Updated:** 2026-04-09
