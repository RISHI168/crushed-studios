#!/bin/bash
# Development environment setup script

set -e

echo "=== Crushed Studios Development Setup ==="

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
  echo "ERROR: Docker is required but not installed"
  echo "Please install Docker from https://docker.com"
  exit 1
fi

if ! command -v git &> /dev/null; then
  echo "ERROR: Git is required but not installed"
  exit 1
fi

echo "✓ All prerequisites installed"

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install

# Create env files
echo ""
echo "Creating .env.local files..."

if [ ! -f "apps/web/.env.local" ]; then
  cp apps/web/.env.example apps/web/.env.local
  echo "✓ Created apps/web/.env.local"
fi

if [ ! -f "apps/api/.env.local" ]; then
  cp apps/api/.env.example apps/api/.env.local
  echo "✓ Created apps/api/.env.local"
fi

if [ ! -f "apps/worker/.env.local" ]; then
  cp apps/worker/.env.example apps/worker/.env.local
  echo "✓ Created apps/worker/.env.local"
fi

# Setup git hooks
echo ""
echo "Setting up git hooks..."
chmod +x .claude/hooks/*.sh
git config core.hooksPath .claude/hooks || true
echo "✓ Git hooks configured"

# Start services with Docker Compose
echo ""
echo "Starting local services (Docker Compose)..."
docker-compose -f infra/docker/docker-compose.yml up -d

# Wait for services to be healthy
echo ""
echo "Waiting for services to start..."
sleep 10

# Run migrations
echo ""
echo "Running database migrations..."
# TODO: Uncomment when migrations exist
# pnpm db:migrate

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Update .env.local files with your API keys"
echo "2. Run 'pnpm dev' to start development servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
