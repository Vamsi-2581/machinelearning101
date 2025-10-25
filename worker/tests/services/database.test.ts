/**
 * Database service unit tests
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createUser,
  getUserByGoogleId,
  getUserById,
  updateUser,
  saveProgress,
  getProgressByUserId,
  saveQuizScore,
  getQuizScoresByUserId,
  saveBookmark,
  getBookmarksByUserId,
  deleteBookmark,
} from '../../src/services/database'
import { ErrorCode } from '../../src/types'

// Mock D1 database
function createMockD1(options?: { runError?: Error }): D1Database {
  const mockPrepare = vi.fn()
  const mockBind = vi.fn()
  const mockRun = options?.runError
    ? vi.fn().mockRejectedValue(options.runError)
    : vi.fn().mockResolvedValue({ success: true, meta: { changes: 1 } })
  const mockFirst = vi.fn()
  const mockAll = vi.fn()

  const chainable = {
    bind: (...args: any[]) => {
      mockBind(...args)
      return chainable
    },
    run: async () => {
      return mockRun()
    },
    first: async <T>() => {
      return mockFirst() as T
    },
    all: async <T>() => {
      return mockAll() as { results: T[] }
    },
  }

  const db = {
    prepare: (query: string) => {
      mockPrepare(query)
      return chainable
    },
  } as unknown as D1Database

  // Attach mocks for assertions
  ;(db as any)._mocks = {
    prepare: mockPrepare,
    bind: mockBind,
    run: mockRun,
    first: mockFirst,
    all: mockAll,
  }

  return db
}

describe('Database Service - User Operations', () => {
  let db: D1Database

  beforeEach(() => {
    db = createMockD1()
  })

  describe('createUser', () => {
    it('should create a new user with correct data', async () => {
      const userData = {
        google_id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: 'https://example.com/pic.jpg',
      }

      const user = await createUser(db, userData)

      expect(user).toMatchObject({
        google_id: userData.google_id,
        email: userData.email,
        name: userData.name,
        picture_url: userData.picture_url,
      })
      expect(user.id).toBeDefined()
      expect(user.created_at).toBeDefined()
      expect(user.updated_at).toBeDefined()
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users')
      )
    })

    it('should use parameterized queries', async () => {
      const userData = {
        google_id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: null,
      }

      await createUser(db, userData)

      expect((db as any)._mocks.bind).toHaveBeenCalledWith(
        expect.any(String), // id
        userData.google_id,
        userData.email,
        userData.name,
        userData.picture_url,
        expect.any(Number), // created_at
        expect.any(Number) // updated_at
      )
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      const failingDb = createMockD1({ runError: new Error('DB Error') })

      const userData = {
        google_id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: null,
      }

      await expect(createUser(failingDb, userData)).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to create user',
      })
    })
  })

  describe('getUserByGoogleId', () => {
    it('should retrieve user by Google ID', async () => {
      const mockUser = {
        id: 'user123',
        google_id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      ;(db as any)._mocks.first.mockResolvedValue(mockUser)

      const user = await getUserByGoogleId(db, 'google123')

      expect(user).toEqual(mockUser)
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE google_id = ?'
      )
      expect((db as any)._mocks.bind).toHaveBeenCalledWith('google123')
    })

    it('should return null if user not found', async () => {
      ;(db as any)._mocks.first.mockResolvedValue(null)

      const user = await getUserByGoogleId(db, 'nonexistent')

      expect(user).toBeNull()
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      ;(db as any)._mocks.first.mockRejectedValue(new Error('DB Error'))

      await expect(getUserByGoogleId(db, 'google123')).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to get user by Google ID',
      })
    })
  })

  describe('getUserById', () => {
    it('should retrieve user by user ID', async () => {
      const mockUser = {
        id: 'user123',
        google_id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      ;(db as any)._mocks.first.mockResolvedValue(mockUser)

      const user = await getUserById(db, 'user123')

      expect(user).toEqual(mockUser)
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?')
      expect((db as any)._mocks.bind).toHaveBeenCalledWith('user123')
    })

    it('should return null if user not found', async () => {
      ;(db as any)._mocks.first.mockResolvedValue(null)

      const user = await getUserById(db, 'nonexistent')

      expect(user).toBeNull()
    })
  })

  describe('updateUser', () => {
    it('should update user with provided fields', async () => {
      const mockUser = {
        id: 'user123',
        google_id: 'google123',
        email: 'updated@example.com',
        name: 'Updated Name',
        picture_url: 'https://example.com/new.jpg',
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      ;(db as any)._mocks.first.mockResolvedValue(mockUser)

      const updates = {
        email: 'updated@example.com',
        name: 'Updated Name',
        picture_url: 'https://example.com/new.jpg',
      }

      const user = await updateUser(db, 'user123', updates)

      expect(user).toEqual(mockUser)
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET')
      )
    })

    it('should only update provided fields', async () => {
      const mockUser = {
        id: 'user123',
        google_id: 'google123',
        email: 'test@example.com',
        name: 'Updated Name',
        picture_url: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      ;(db as any)._mocks.first.mockResolvedValue(mockUser)

      const updates = { name: 'Updated Name' }

      await updateUser(db, 'user123', updates)

      expect((db as any)._mocks.bind).toHaveBeenCalledWith(
        'Updated Name',
        expect.any(Number), // updated_at
        'user123'
      )
    })

    it('should throw NOT_FOUND if user does not exist after update', async () => {
      ;(db as any)._mocks.first.mockResolvedValue(null)

      await expect(updateUser(db, 'nonexistent', { name: 'Test' })).rejects.toMatchObject({
        code: ErrorCode.NOT_FOUND,
        message: 'User not found after update',
      })
    })
  })
})

describe('Database Service - Progress Operations', () => {
  let db: D1Database

  beforeEach(() => {
    db = createMockD1()
  })

  describe('saveProgress', () => {
    it('should save progress with upsert', async () => {
      const progress = await saveProgress(db, 'user123', 'module1', true, Date.now())

      expect(progress).toMatchObject({
        user_id: 'user123',
        module_id: 'module1',
        completed: true,
      })
      expect(progress.id).toBeDefined()
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO progress')
      )
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('ON CONFLICT')
      )
    })

    it('should use parameterized queries', async () => {
      const completedAt = Date.now()
      await saveProgress(db, 'user123', 'module1', true, completedAt)

      expect((db as any)._mocks.bind).toHaveBeenCalledWith(
        expect.any(String), // id
        'user123',
        'module1',
        1, // completed as integer
        completedAt,
        1, // completed for update
        completedAt
      )
    })

    it('should handle incomplete progress', async () => {
      const progress = await saveProgress(db, 'user123', 'module1', false, null)

      expect(progress.completed).toBe(false)
      expect(progress.completed_at).toBeNull()
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      const failingDb = createMockD1({ runError: new Error('DB Error') })

      await expect(saveProgress(failingDb, 'user123', 'module1', true, Date.now())).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to save progress',
      })
    })
  })

  describe('getProgressByUserId', () => {
    it('should retrieve all progress for a user', async () => {
      const mockProgress = [
        {
          id: 'prog1',
          user_id: 'user123',
          module_id: 'module1',
          completed: 1,
          completed_at: Date.now(),
        },
        {
          id: 'prog2',
          user_id: 'user123',
          module_id: 'module2',
          completed: 0,
          completed_at: null,
        },
      ]

      ;(db as any)._mocks.all.mockResolvedValue({ results: mockProgress })

      const progress = await getProgressByUserId(db, 'user123')

      expect(progress).toHaveLength(2)
      expect(progress[0].completed).toBe(true) // Converted from 1
      expect(progress[1].completed).toBe(false) // Converted from 0
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM progress WHERE user_id = ?')
      )
    })

    it('should return empty array if no progress found', async () => {
      ;(db as any)._mocks.all.mockResolvedValue({ results: [] })

      const progress = await getProgressByUserId(db, 'user123')

      expect(progress).toEqual([])
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      ;(db as any)._mocks.all.mockRejectedValue(new Error('DB Error'))

      await expect(getProgressByUserId(db, 'user123')).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to get progress',
      })
    })
  })
})

describe('Database Service - Quiz Score Operations', () => {
  let db: D1Database

  beforeEach(() => {
    db = createMockD1()
  })

  describe('saveQuizScore', () => {
    it('should save quiz score', async () => {
      const completedAt = Date.now()
      const quizScore = await saveQuizScore(db, 'user123', 'module1', 8, 10, completedAt)

      expect(quizScore).toMatchObject({
        user_id: 'user123',
        module_id: 'module1',
        score: 8,
        total: 10,
        completed_at: completedAt,
      })
      expect(quizScore.id).toBeDefined()
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO quiz_scores')
      )
    })

    it('should use parameterized queries', async () => {
      const completedAt = Date.now()
      await saveQuizScore(db, 'user123', 'module1', 8, 10, completedAt)

      expect((db as any)._mocks.bind).toHaveBeenCalledWith(
        expect.any(String), // id
        'user123',
        'module1',
        8,
        10,
        completedAt
      )
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      const failingDb = createMockD1({ runError: new Error('DB Error') })

      await expect(
        saveQuizScore(failingDb, 'user123', 'module1', 8, 10, Date.now())
      ).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to save quiz score',
      })
    })
  })

  describe('getQuizScoresByUserId', () => {
    it('should retrieve all quiz scores for a user', async () => {
      const mockScores = [
        {
          id: 'quiz1',
          user_id: 'user123',
          module_id: 'module1',
          score: 8,
          total: 10,
          completed_at: Date.now(),
        },
        {
          id: 'quiz2',
          user_id: 'user123',
          module_id: 'module2',
          score: 9,
          total: 10,
          completed_at: Date.now(),
        },
      ]

      ;(db as any)._mocks.all.mockResolvedValue({ results: mockScores })

      const scores = await getQuizScoresByUserId(db, 'user123')

      expect(scores).toEqual(mockScores)
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM quiz_scores WHERE user_id = ?')
      )
    })

    it('should return empty array if no scores found', async () => {
      ;(db as any)._mocks.all.mockResolvedValue({ results: [] })

      const scores = await getQuizScoresByUserId(db, 'user123')

      expect(scores).toEqual([])
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      ;(db as any)._mocks.all.mockRejectedValue(new Error('DB Error'))

      await expect(getQuizScoresByUserId(db, 'user123')).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to get quiz scores',
      })
    })
  })
})

describe('Database Service - Bookmark Operations', () => {
  let db: D1Database

  beforeEach(() => {
    db = createMockD1()
  })

  describe('saveBookmark', () => {
    it('should save bookmark with upsert', async () => {
      const createdAt = Date.now()
      const bookmark = await saveBookmark(db, 'user123', 'module1', createdAt)

      expect(bookmark).toMatchObject({
        user_id: 'user123',
        module_id: 'module1',
        created_at: createdAt,
      })
      expect(bookmark.id).toBeDefined()
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO bookmarks')
      )
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('ON CONFLICT')
      )
    })

    it('should use parameterized queries', async () => {
      const createdAt = Date.now()
      await saveBookmark(db, 'user123', 'module1', createdAt)

      expect((db as any)._mocks.bind).toHaveBeenCalledWith(
        expect.any(String), // id
        'user123',
        'module1',
        createdAt,
        createdAt // for update
      )
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      const failingDb = createMockD1({ runError: new Error('DB Error') })

      await expect(saveBookmark(failingDb, 'user123', 'module1', Date.now())).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to save bookmark',
      })
    })
  })

  describe('getBookmarksByUserId', () => {
    it('should retrieve all bookmarks for a user', async () => {
      const mockBookmarks = [
        {
          id: 'bm1',
          user_id: 'user123',
          module_id: 'module1',
          created_at: Date.now(),
        },
        {
          id: 'bm2',
          user_id: 'user123',
          module_id: 'module2',
          created_at: Date.now(),
        },
      ]

      ;(db as any)._mocks.all.mockResolvedValue({ results: mockBookmarks })

      const bookmarks = await getBookmarksByUserId(db, 'user123')

      expect(bookmarks).toEqual(mockBookmarks)
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM bookmarks WHERE user_id = ?')
      )
    })

    it('should return empty array if no bookmarks found', async () => {
      ;(db as any)._mocks.all.mockResolvedValue({ results: [] })

      const bookmarks = await getBookmarksByUserId(db, 'user123')

      expect(bookmarks).toEqual([])
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      ;(db as any)._mocks.all.mockRejectedValue(new Error('DB Error'))

      await expect(getBookmarksByUserId(db, 'user123')).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to get bookmarks',
      })
    })
  })

  describe('deleteBookmark', () => {
    it('should delete bookmark and return true', async () => {
      const result = await deleteBookmark(db, 'user123', 'module1')

      expect(result).toBe(true)
      expect((db as any)._mocks.prepare).toHaveBeenCalledWith(
        'DELETE FROM bookmarks WHERE user_id = ? AND module_id = ?'
      )
      expect((db as any)._mocks.bind).toHaveBeenCalledWith('user123', 'module1')
    })

    it('should return false if bookmark not found', async () => {
      const dbWithNoChanges = createMockD1()
      ;(dbWithNoChanges as any)._mocks.run = vi.fn().mockResolvedValue({
        success: true,
        meta: { changes: 0 },
      })

      // Override the run method in the chain
      const mockPrepare = vi.fn()
      const mockBind = vi.fn()
      const chainable = {
        bind: (...args: any[]) => {
          mockBind(...args)
          return chainable
        },
        run: async () => {
          return { success: true, meta: { changes: 0 } }
        },
      }

      const db2 = {
        prepare: (query: string) => {
          mockPrepare(query)
          return chainable
        },
      } as unknown as D1Database

      const result = await deleteBookmark(db2, 'user123', 'nonexistent')

      expect(result).toBe(false)
    })

    it('should throw DATABASE_ERROR on failure', async () => {
      const failingDb = createMockD1({ runError: new Error('DB Error') })

      await expect(deleteBookmark(failingDb, 'user123', 'module1')).rejects.toMatchObject({
        code: ErrorCode.DATABASE_ERROR,
        message: 'Failed to delete bookmark',
      })
    })
  })
})
