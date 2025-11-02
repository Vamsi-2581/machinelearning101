-- Migration: Update bookmarks table schema
-- Requirements: 4.1, 6.1
-- 
-- This migration updates the bookmarks table to support:
-- - Multiple bookmarks per module (removes UNIQUE constraint)
-- - Bookmark names (adds name column)
-- - Parameter storage (adds parameters column for JSON)
-- - Update tracking (adds updated_at column)

-- Drop the old unique constraint on (user_id, module_id)
-- Note: SQLite doesn't support DROP CONSTRAINT directly, so we need to recreate the table
DROP INDEX IF EXISTS idx_bookmarks_user_id;

-- Create a temporary table with the new schema
CREATE TABLE IF NOT EXISTS bookmarks_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parameters TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Copy existing data from old table (if it exists)
-- Set default values for new columns
INSERT INTO bookmarks_new (id, user_id, module_id, name, parameters, created_at, updated_at)
SELECT 
  id, 
  user_id, 
  module_id, 
  'Saved Configuration' as name,
  '{}' as parameters,
  created_at,
  created_at as updated_at
FROM bookmarks
WHERE EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='bookmarks');

-- Drop the old table
DROP TABLE IF EXISTS bookmarks;

-- Rename the new table to bookmarks
ALTER TABLE bookmarks_new RENAME TO bookmarks;

-- Create composite index on (user_id, module_id) for efficient queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_module ON bookmarks(user_id, module_id);

-- Create index on user_id for user-based queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
