#!/bin/bash
# Post-build hook: bundle size check

set -e

echo "Checking bundle sizes..."

# Check web app bundle
WEB_SIZE=$(du -sh apps/web/.next/standalone | cut -f1)
echo "Web app size: $WEB_SIZE"

# Warn if too large
if (( $(echo "$WEB_SIZE" | sed 's/M.*//' | tr -d 'a-zA-Z') > 500 )); then
  echo "WARNING: Web bundle exceeds 500MB"
fi

echo "Bundle size check complete!"
exit 0
