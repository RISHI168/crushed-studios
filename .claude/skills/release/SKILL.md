# Release Process Skill

Manage releases and deployments for Crushed Studios.

## Pre-Release Checklist

- [ ] All PRs merged to develop are tested
- [ ] CHANGELOG.md updated with version and changes
- [ ] Version bump: `pnpm version` (major.minor.patch)
- [ ] Security scan passed: `pnpm audit`
- [ ] All CI/CD pipelines green
- [ ] Database migrations reviewed
- [ ] Terraform changes reviewed
- [ ] Release notes prepared

## Deployment Steps

### Staging Deployment

1. Create release branch: `git checkout -b release/v1.2.3`
2. Update version in package.json files
3. Create GitHub release draft
4. Merge to `develop`
5. Trigger staging deploy: `git push --follow-tags`
6. Monitor deployment in AWS console
7. Smoke test in staging environment
8. Get approval from team lead

### Production Deployment

1. Verify staging deployment successful for 24 hours
2. Create release tag: `git tag v1.2.3`
3. Merge `develop` to `main`: `git checkout main && git merge develop`
4. Push with tags: `git push origin main --follow-tags`
5. GitHub Actions triggers production deployment
6. Monitor CloudWatch logs for errors
7. Verify health checks passing
8. Notify stakeholders

## Rollback Procedure

If critical issue detected post-deployment:

1. Identify last known good version
2. Create rollback PR from previous tag
3. Deploy rollback to production
4. Document incident in runbooks
5. Post-mortem meeting within 24 hours

## Post-Release

- [ ] Close GitHub milestone
- [ ] Tag related issues with release version
- [ ] Update product changelog for customers
- [ ] Announce release in team chat
- [ ] Monitor error tracking (Sentry) for new issues
- [ ] Plan hotfix if critical bugs found
