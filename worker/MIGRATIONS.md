# Database Migrations Guide

This guide covers database schema management and migrations for the Cloudflare D1 database.

## Requirements Coverage

- **6.1**: Users table with all required fields
- **6.2**: Progress table with user_id and module tracking
- **6.3**: Quiz scores table with score tracking
- **6.4**: Bookmarks table with user bookmarks
- **6.5**: Cascade deletes for data cleanup
- **6.6**: Indexes for optimal query performance

## Database Schema

The database consists of four main tables:

### 1. Users Table
Stores user account information from Google OAuth.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  picture_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

**Indexes:**
- `idx_users_google_id` on `google_id`
- `idx_users_email` on `email`

### 2. Progress Table
Tracks module completion status for each user.

```sql
CREATE TABLE progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, module_id)
);
```

**Indexes:**
- `idx_progress_user_id` on `user_id`

### 3. Quiz Scores Table
Stores quiz completion results.

```sql
CREATE TABLE quiz_scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- `idx_quiz_scores_user_id` on `user_id`

### 4. Bookmarks Table
Stores user bookmarks for modules.

```sql
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, module_id)
);
```

**Indexes:**
- `idx_bookmarks_user_id` on `user_id`

## Running Migrations

### Prerequisites

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

3. Create the D1 database (first time only):
   ```bash
   wrangler d1 create ml-platform-db
   ```

4. Update `wrangler.toml` with the database ID from the output.

### Local Development

Run migrations against local D1 database:

```bash
cd worker
./migrate.sh dev
```

Or manually:

```bash
wrangler d1 execute ml-platform-db --file=schema.sql --local
```

### Production

Run migrations against production D1 database:

```bash
cd worker
./migrate.sh prod
```

Or manually:

```bash
wrangler d1 execute ml-platform-db --file=schema.sql --remote
```

## Verifying Migrations

### Check Tables

```bash
# Local
wrangler d1 execute ml-platform-db --command="SELECT name FROM sqlite_master WHERE type='table';" --local

# Production
wrangler d1 execute ml-platform-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

Expected output:
- users
- progress
- quiz_scores
- bookmarks

### Check Indexes

```bash
# Local
wrangler d1 execute ml-platform-db --command="SELECT name FROM sqlite_master WHERE type='index';" --local

# Production
wrangler d1 execute ml-platform-db --command="SELECT name FROM sqlite_master WHERE type='index';" --remote
```

Expected indexes:
- idx_users_google_id
- idx_users_email
- idx_progress_user_id
- idx_quiz_scores_user_id
- idx_bookmarks_user_id

### Verify Foreign Keys

```bash
wrangler d1 execute ml-platform-db --command="PRAGMA foreign_key_list(progress);" --local
```

## Database Management

### Backup Database

```bash
# Export all data
wrangler d1 export ml-platform-db --output=backup.sql --remote
```

### Reset Database (Development Only)

```bash
# Drop all tables
wrangler d1 execute ml-platform-db --command="DROP TABLE IF EXISTS bookmarks; DROP TABLE IF EXISTS quiz_scores; DROP TABLE IF EXISTS progress; DROP TABLE IF EXISTS users;" --local

# Re-run migrations
./migrate.sh dev
```

### Query Database

```bash
# Local
wrangler d1 execute ml-platform-db --command="SELECT * FROM users LIMIT 5;" --local

# Production
wrangler d1 execute ml-platform-db --command="SELECT * FROM users LIMIT 5;" --remote
```

## Troubleshooting

### Migration Fails

1. **Error: Database not found**
   - Create the database: `wrangler d1 create ml-platform-db`
   - Update `wrangler.toml` with the database ID

2. **Error: Table already exists**
   - The schema uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen
   - If it does, the migration is idempotent and safe to re-run

3. **Error: Foreign key constraint failed**
   - Ensure tables are created in the correct order (users first)
   - The schema.sql file has the correct order

### Performance Issues

If queries are slow:

1. Verify indexes exist:
   ```bash
   wrangler d1 execute ml-platform-db --command="SELECT name FROM sqlite_master WHERE type='index';" --local
   ```

2. Check query plans:
   ```bash
   wrangler d1 execute ml-platform-db --command="EXPLAIN QUERY PLAN SELECT * FROM progress WHERE user_id = 'test';" --local
   ```

## Data Integrity

### Cascade Deletes

When a user is deleted, all related data is automatically removed:

```sql
DELETE FROM users WHERE id = 'user-123';
-- Automatically deletes:
-- - All progress records for user-123
-- - All quiz_scores records for user-123
-- - All bookmarks records for user-123
```

### Unique Constraints

- `users.google_id`: Prevents duplicate Google accounts
- `users.email`: Prevents duplicate email addresses
- `progress(user_id, module_id)`: One progress record per user per module
- `bookmarks(user_id, module_id)`: One bookmark per user per module

## Future Migrations

When adding new migrations:

1. Create a new SQL file: `migrations/001_add_feature.sql`
2. Update the migration script to track applied migrations
3. Use versioning to prevent re-running migrations
4. Always test locally before running in production

## References

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
