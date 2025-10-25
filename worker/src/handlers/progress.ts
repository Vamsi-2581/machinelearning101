/**
 * Progress sync handlers
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.5, 5.6
 */

import { authenticateRequest } from '../middleware/auth'
import { 
  saveProgress, 
  saveQuizScore, 
  saveBookmark, 
  getProgressByUserId,
  getQuizScoresByUserId,
  getBookmarksByUserId
} from '../services/database'
import { isValidModuleId } from '../utils/validation'
import { createValidationError, createInternalError, logError } from '../utils/errors'
import type { Env, SyncProgressRequest, SyncResponse, ProgressResponse } from '../types'

/**
 * Progress sync handler
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 5.5
 * 
 * Validates JWT, validates request body, saves progress data, quiz scores, and bookmarks
 * Handles conflicts using timestamp comparison (last-write-wins)
 * 
 * @param request - Incoming request with progress data
 * @param env - Environment bindings
 * @returns Response with success status and timestamp
 */
export async function handleSyncProgress(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Validate JWT and get user context
    const authContext = await authenticateRequest(request, env)
    const userId = authContext.user.id
    
    // Parse and validate request body
    let body: SyncProgressRequest
    try {
      body = await request.json() as SyncProgressRequest
    } catch (error) {
      throw createValidationError('Invalid JSON in request body')
    }
    
    // Validate request structure
    if (!body || typeof body !== 'object') {
      throw createValidationError('Request body must be an object')
    }
    
    if (!Array.isArray(body.modules)) {
      throw createValidationError('modules must be an array')
    }
    
    if (!Array.isArray(body.quizzes)) {
      throw createValidationError('quizzes must be an array')
    }
    
    if (!Array.isArray(body.bookmarks)) {
      throw createValidationError('bookmarks must be an array')
    }
    
    // Validate and save progress data
    for (const progressItem of body.modules) {
      // Validate module_id
      if (!isValidModuleId(progressItem.module_id)) {
        throw createValidationError(`Invalid module_id: ${progressItem.module_id}`)
      }
      
      // Validate completed field
      if (typeof progressItem.completed !== 'boolean') {
        throw createValidationError('completed must be a boolean')
      }
      
      // Validate completed_at (can be null or number)
      if (progressItem.completed_at !== null && typeof progressItem.completed_at !== 'number') {
        throw createValidationError('completed_at must be null or a number')
      }
      
      // Save progress (upsert handles conflicts - last write wins)
      await saveProgress(
        env.DB,
        userId,
        progressItem.module_id,
        progressItem.completed,
        progressItem.completed_at
      )
    }
    
    // Validate and save quiz scores
    for (const quizItem of body.quizzes) {
      // Validate module_id
      if (!isValidModuleId(quizItem.module_id)) {
        throw createValidationError(`Invalid module_id: ${quizItem.module_id}`)
      }
      
      // Validate score
      if (typeof quizItem.score !== 'number' || quizItem.score < 0) {
        throw createValidationError('score must be a non-negative number')
      }
      
      // Validate total
      if (typeof quizItem.total !== 'number' || quizItem.total < 0) {
        throw createValidationError('total must be a non-negative number')
      }
      
      // Validate completed_at
      if (typeof quizItem.completed_at !== 'number') {
        throw createValidationError('completed_at must be a number')
      }
      
      // Save quiz score
      await saveQuizScore(
        env.DB,
        userId,
        quizItem.module_id,
        quizItem.score,
        quizItem.total,
        quizItem.completed_at
      )
    }
    
    // Validate and save bookmarks
    for (const bookmarkItem of body.bookmarks) {
      // Validate module_id
      if (!isValidModuleId(bookmarkItem.module_id)) {
        throw createValidationError(`Invalid module_id: ${bookmarkItem.module_id}`)
      }
      
      // Validate created_at
      if (typeof bookmarkItem.created_at !== 'number') {
        throw createValidationError('created_at must be a number')
      }
      
      // Save bookmark (upsert handles conflicts - last write wins)
      await saveBookmark(
        env.DB,
        userId,
        bookmarkItem.module_id,
        bookmarkItem.created_at
      )
    }
    
    // Return success response with current timestamp
    const syncResponse: SyncResponse = {
      success: true,
      synced_at: Date.now()
    }
    
    return new Response(JSON.stringify(syncResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    // If it's already an API error, re-throw it
    if ((error as any).code) {
      throw error
    }
    
    logError(error as Error, { handler: 'handleSyncProgress' })
    throw createInternalError('Failed to sync progress')
  }
}

/**
 * Progress retrieval handler
 * Requirements: 4.4, 5.6
 * 
 * Validates JWT, fetches all progress data, quiz scores, and bookmarks for the user
 * 
 * @param request - Incoming request
 * @param env - Environment bindings
 * @returns Response with combined progress data
 */
export async function handleGetProgress(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Validate JWT and get user context
    const authContext = await authenticateRequest(request, env)
    const userId = authContext.user.id
    
    // Fetch progress data from database
    const modules = await getProgressByUserId(env.DB, userId)
    
    // Fetch quiz scores from database
    const quizzes = await getQuizScoresByUserId(env.DB, userId)
    
    // Fetch bookmarks from database
    const bookmarks = await getBookmarksByUserId(env.DB, userId)
    
    // Return combined progress data
    const progressResponse: ProgressResponse = {
      modules,
      quizzes,
      bookmarks
    }
    
    return new Response(JSON.stringify(progressResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    // If it's already an API error, re-throw it
    if ((error as any).code) {
      throw error
    }
    
    logError(error as Error, { handler: 'handleGetProgress' })
    throw createInternalError('Failed to fetch progress')
  }
}
