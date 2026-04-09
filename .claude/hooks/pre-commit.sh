#!/bin/bash
# Pre-commit hook: lint, type-check, and secret scan

set -e

echo "Running pre-commit checks..."

# Lint
echo "Linting..."
pnpm lint || exit 1

# Type check
echo "Type checking..."
pnpm type-check || exit 1

# Secret scan
echo "Scanning for secrets..."
grep -r "NEXTAUTH_SECRET\|OPENAI_API_KEY\|ANTHROPIC_API_KEY\|AWS_SECRET" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" \
  --exclude-dir=node_modules --exclude-dir=.git \
  . && echo "ERROR: Found hardcoded secrets!" && exit 1 || true

echo "Pre-commit checks passed!"
exit 0
