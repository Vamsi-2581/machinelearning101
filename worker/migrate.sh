#!/bin/bash

# D1 Database Migration Script
# Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
#
# This script initializes the Cloudflare D1 database with the schema
# Usage: ./migrate.sh [environment]
#   environment: dev (default) or prod

set -e

ENVIRONMENT=${1:-dev}
DB_NAME="ml-platform-db"

echo "🚀 Starting D1 database migration for $ENVIRONMENT environment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI is not installed"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

# Check if schema.sql exists
if [ ! -f "schema.sql" ]; then
    echo "❌ Error: schema.sql not found"
    echo "Make sure you're running this script from the worker directory"
    exit 1
fi

# Determine the database binding name from wrangler.toml
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "📊 Migrating production database..."
    wrangler d1 execute $DB_NAME --file=schema.sql --remote
else
    echo "📊 Migrating local/dev database..."
    wrangler d1 execute $DB_NAME --file=schema.sql --local
fi

echo "✅ Migration completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Verify tables: wrangler d1 execute $DB_NAME --command='SELECT name FROM sqlite_master WHERE type=\"table\";' --local"
echo "  2. Check indexes: wrangler d1 execute $DB_NAME --command='SELECT name FROM sqlite_master WHERE type=\"index\";' --local"
echo ""
echo "For production migration, run: ./migrate.sh prod"
