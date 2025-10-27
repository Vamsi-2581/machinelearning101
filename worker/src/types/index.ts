/**
 * TypeScript type definitions
 * Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 4.1, 4.2, 4.3
 */

// User types
export interface User {
  id: string
  google_id: string
  email: string
  name: string
  picture_url: string | null
  created_at: number
  updated_at: number
}

// Progress types
export interface Progress {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  completed_at: number | null
}

// Quiz score types
export interface QuizScore {
  id: string
  user_id: string
  module_id: string
  score: number
  total: number
  completed_at: number
}

// Bookmark types
export interface Bookmark {
  id: string
  user_id: string
  module_id: string
  created_at: number
}

// JWT payload
export interface JWTPayload {
  sub: string  // user id
  email: string
  name: string
  iat: number
  exp: number
}

// OAuth types
export interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token?: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

// API Error types
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  OAUTH_FAILED = 'OAUTH_FAILED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface ApiError {
  code: ErrorCode
  message: string
  details?: any
}

// Request/Response types
export interface SyncProgressRequest {
  modules: Array<{
    module_id: string
    completed: boolean
    completed_at: number | null
  }>
  quizzes: Array<{
    module_id: string
    score: number
    total: number
    completed_at: number
  }>
  bookmarks: Array<{
    module_id: string
    created_at: number
  }>
}

export interface ProgressResponse {
  modules: Progress[]
  quizzes: QuizScore[]
  bookmarks: Bookmark[]
}

export interface SyncResponse {
  success: boolean
  synced_at: number
}

export interface UserProfileResponse {
  id: string
  email: string
  name: string
  picture_url: string | null
}

export interface LogoutResponse {
  success: boolean
}

// Environment bindings
export interface Env {
  ml_platform_db: D1Database 
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_REDIRECT_URI: string
  JWT_SECRET: string
  FRONTEND_URL: string
}

// Request context with authenticated user
export interface AuthenticatedRequest {
  user: {
    id: string
    email: string
    name: string
  }
}

// OAuth state parameter
export interface OAuthState {
  state: string
  timestamp: number
}
