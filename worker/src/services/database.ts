/**
 * Database service for D1 operations
 * Requirements: 1.3, 1.4, 2.3, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 7.5
 */

import type { User, Progress, QuizScore, Bookmark, Env } from '../types'
import { ErrorCode } from '../types'

/**
 * Generate a unique ID using crypto
 */
function generateId(): string {
  return crypto.randomUUID()
}

/**
 * User operations
 * Requirements: 1.3, 1.4, 2.3, 6.1, 7.5
 */

/**
 * Create a new user in the database
 * @param db D1 database instance
 * @param userData User data from Google OAuth
 * @returns Created user
 */
export async function createUser(
  db: D1Database,
  userData: {
    google_id: string
    email: string
    name: string
    picture_url: string | null
  }
): Promise<User> {
  const id = generateId()
  const now = Date.now()

  try {
    await db
      .prepare(
        `INSERT INTO users (id, google_id, email, name, picture_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, userData.google_id, userData.email, userData.name, userData.picture_url, now, now)
      .run()

    return {
      id,
      google_id: userData.google_id,
      email: userData.email,
      name: userData.name,
      picture_url: userData.picture_url,
      created_at: now,
      updated_at: now,
    }
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to create user',
      details: error,
    }
  }
}

/**
 * Get user by Google ID
 * @param db D1 database instance
 * @param googleId Google user ID
 * @returns User or null if not found
 */
export async function getUserByGoogleId(db: D1Database, googleId: string): Promise<User | null> {
  try {
    const result = await db
      .prepare('SELECT * FROM users WHERE google_id = ?')
      .bind(googleId)
      .first<User>()

    return result
  } catch (error) {
    console.error(error)
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to get user by Google ID',
      details: error,
    }
  }
}

/**
 * Get user by user ID
 * @param db D1 database instance
 * @param userId User ID
 * @returns User or null if not found
 */
export async function getUserById(db: D1Database, userId: string): Promise<User | null> {
  try {
    const result = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first<User>()

    return result
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to get user by ID',
      details: error,
    }
  }
}

/**
 * Update user information
 * @param db D1 database instance
 * @param userId User ID
 * @param updates User data to update
 * @returns Updated user
 */
export async function updateUser(
  db: D1Database,
  userId: string,
  updates: {
    email?: string
    name?: string
    picture_url?: string | null
  }
): Promise<User> {
  const now = Date.now()

  try {
    // Build dynamic update query based on provided fields
    const fields: string[] = []
    const values: any[] = []

    if (updates.email !== undefined) {
      fields.push('email = ?')
      values.push(updates.email)
    }
    if (updates.name !== undefined) {
      fields.push('name = ?')
      values.push(updates.name)
    }
    if (updates.picture_url !== undefined) {
      fields.push('picture_url = ?')
      values.push(updates.picture_url)
    }

    fields.push('updated_at = ?')
    values.push(now)
    values.push(userId)

    await db
      .prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run()

    const user = await getUserById(db, userId)
    if (!user) {
      throw {
        code: ErrorCode.NOT_FOUND,
        message: 'User not found after update',
      }
    }

    return user
  } catch (error) {
    if ((error as any).code) {
      throw error
    }
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to update user',
      details: error,
    }
  }
}

/**
 * Progress operations
 * Requirements: 4.1, 4.4, 4.5, 6.2, 7.5
 */

/**
 * Save or update progress data (upsert)
 * @param db D1 database instance
 * @param userId User ID
 * @param moduleId Module ID
 * @param completed Whether module is completed
 * @param completedAt Completion timestamp
 * @returns Saved progress
 */
export async function saveProgress(
  db: D1Database,
  userId: string,
  moduleId: string,
  completed: boolean,
  completedAt: number | null
): Promise<Progress> {
  const id = generateId()

  try {
    // Use INSERT OR REPLACE for upsert behavior
    await db
      .prepare(
        `INSERT INTO progress (id, user_id, module_id, completed, completed_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(user_id, module_id) 
         DO UPDATE SET completed = ?, completed_at = ?`
      )
      .bind(id, userId, moduleId, completed ? 1 : 0, completedAt, completed ? 1 : 0, completedAt)
      .run()

    return {
      id,
      user_id: userId,
      module_id: moduleId,
      completed,
      completed_at: completedAt,
    }
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to save progress',
      details: error,
    }
  }
}

/**
 * Get all progress data for a user
 * @param db D1 database instance
 * @param userId User ID
 * @returns Array of progress records
 */
export async function getProgressByUserId(db: D1Database, userId: string): Promise<Progress[]> {
  try {
    const result = await db
      .prepare('SELECT * FROM progress WHERE user_id = ? ORDER BY completed_at DESC')
      .bind(userId)
      .all<Progress>()

    // Convert completed from integer to boolean
    return (result.results || []).map((p) => ({
      ...p,
      completed: Boolean(p.completed),
    }))
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to get progress',
      details: error,
    }
  }
}

/**
 * Quiz score operations
 * Requirements: 4.2, 4.4, 4.5, 6.3, 7.5
 */

/**
 * Save a quiz score
 * @param db D1 database instance
 * @param userId User ID
 * @param moduleId Module ID
 * @param score Score achieved
 * @param total Total possible score
 * @param completedAt Completion timestamp
 * @returns Saved quiz score
 */
export async function saveQuizScore(
  db: D1Database,
  userId: string,
  moduleId: string,
  score: number,
  total: number,
  completedAt: number
): Promise<QuizScore> {
  const id = generateId()

  try {
    await db
      .prepare(
        `INSERT INTO quiz_scores (id, user_id, module_id, score, total, completed_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(id, userId, moduleId, score, total, completedAt)
      .run()

    return {
      id,
      user_id: userId,
      module_id: moduleId,
      score,
      total,
      completed_at: completedAt,
    }
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to save quiz score',
      details: error,
    }
  }
}

/**
 * Get all quiz scores for a user
 * @param db D1 database instance
 * @param userId User ID
 * @returns Array of quiz score records
 */
export async function getQuizScoresByUserId(db: D1Database, userId: string): Promise<QuizScore[]> {
  try {
    const result = await db
      .prepare('SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY completed_at DESC')
      .bind(userId)
      .all<QuizScore>()

    return result.results || []
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to get quiz scores',
      details: error,
    }
  }
}

/**
 * Bookmark operations
 * Requirements: 4.3, 4.4, 4.5, 6.4, 7.5
 */

/**
 * Save or update a bookmark (upsert)
 * @param db D1 database instance
 * @param userId User ID
 * @param moduleId Module ID
 * @param createdAt Creation timestamp
 * @returns Saved bookmark
 */
export async function saveBookmark(
  db: D1Database,
  userId: string,
  moduleId: string,
  createdAt: number
): Promise<Bookmark> {
  const id = generateId()

  try {
    // Use INSERT OR REPLACE for upsert behavior
    await db
      .prepare(
        `INSERT INTO bookmarks (id, user_id, module_id, created_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, module_id) 
         DO UPDATE SET created_at = ?`
      )
      .bind(id, userId, moduleId, createdAt, createdAt)
      .run()

    return {
      id,
      user_id: userId,
      module_id: moduleId,
      created_at: createdAt,
    }
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to save bookmark',
      details: error,
    }
  }
}

/**
 * Get all bookmarks for a user
 * @param db D1 database instance
 * @param userId User ID
 * @returns Array of bookmark records
 */
export async function getBookmarksByUserId(db: D1Database, userId: string): Promise<Bookmark[]> {
  try {
    const result = await db
      .prepare('SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC')
      .bind(userId)
      .all<Bookmark>()

    return result.results || []
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to get bookmarks',
      details: error,
    }
  }
}

/**
 * Delete a bookmark
 * @param db D1 database instance
 * @param userId User ID
 * @param moduleId Module ID
 * @returns True if deleted, false if not found
 */
export async function deleteBookmark(
  db: D1Database,
  userId: string,
  moduleId: string
): Promise<boolean> {
  try {
    const result = await db
      .prepare('DELETE FROM bookmarks WHERE user_id = ? AND module_id = ?')
      .bind(userId, moduleId)
      .run()

    return (result.meta?.changes || 0) > 0
  } catch (error) {
    throw {
      code: ErrorCode.DATABASE_ERROR,
      message: 'Failed to delete bookmark',
      details: error,
    }
  }
}
