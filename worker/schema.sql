-- Machine Learning 101 - Database Schema
-- Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6

-- Users table
-- Stores user account information from Google OAuth
-- Requirement 6.1: users table with id, google_id, email, name, picture_url, created_at, updated_at
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  picture_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Indexes for optimal query performance (Requirement 6.6)
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Progress table
-- Tracks module completion status for each user
-- Requirement 6.2: progress table with id, user_id, module_id, completed, completed_at
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, module_id)
);

-- Index for user-based queries (Requirement 6.6)
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);

-- Quiz scores table
-- Stores quiz completion results for each user
-- Requirement 6.3: quiz_scores table with id, user_id, module_id, score, total, completed_at
CREATE TABLE IF NOT EXISTS quiz_scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for user-based queries (Requirement 6.6)
CREATE INDEX IF NOT EXISTS idx_quiz_scores_user_id ON quiz_scores(user_id);

-- Bookmarks table
-- Stores user bookmarks for modules with names and parameters
-- Requirements: 4.1, 6.1, 6.4
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parameters TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for user-based queries (Requirement 6.6)
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_module ON bookmarks(user_id, module_id);

-- Note: Foreign key constraints with ON DELETE CASCADE (Requirement 6.5)
-- ensure that when a user is deleted, all related progress, quiz scores,
-- and bookmarks are automatically removed.
