#!/bin/bash
# Pre-push hook: run tests

set -e

echo "Running pre-push checks..."

# Run all tests
echo "Running tests..."
pnpm test:all || exit 1

echo "All checks passed! Ready to push."
exit 0
