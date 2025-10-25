/**
 * Error handling utilities
 * Requirements: 5.7, 7.6
 */

import { ErrorCode, ApiError } from '../types'

/**
 * Custom API Error class
 * Requirements: 5.7
 */
export class ApiErrorClass extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: any

  constructor(code: ErrorCode, message: string, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = errorCodeToHttpStatus(code)
    this.details = details
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Maps error codes to HTTP status codes
 * Requirements: 5.7
 */
export function errorCodeToHttpStatus(code: ErrorCode): number {
  const statusMap: Record<ErrorCode, number> = {
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.INVALID_TOKEN]: 401,
    [ErrorCode.OAUTH_FAILED]: 400,
    [ErrorCode.DATABASE_ERROR]: 500,
    [ErrorCode.VALIDATION_ERROR]: 400,
    [ErrorCode.NOT_FOUND]: 404,
    [ErrorCode.INTERNAL_ERROR]: 500
  }

  return statusMap[code] || 500
}

/**
 * Formats error into API response format
 * Requirements: 5.7
 */
export function formatErrorResponse(error: ApiErrorClass | Error): ApiError {
  if (error instanceof ApiErrorClass) {
    return {
      code: error.code,
      message: error.message,
      details: error.details
    }
  }

  // Handle unknown errors
  return {
    code: ErrorCode.INTERNAL_ERROR,
    message: 'An unexpected error occurred',
    details: undefined
  }
}

/**
 * Creates a JSON response for errors
 * Requirements: 5.7
 */
export function createErrorResponse(error: ApiErrorClass | Error): Response {
  const apiError = formatErrorResponse(error)
  const statusCode = error instanceof ApiErrorClass 
    ? error.statusCode 
    : 500

  return new Response(JSON.stringify(apiError), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * Sanitizes error data for logging by removing sensitive information
 * Requirements: 7.6
 */
export function sanitizeErrorForLogging(error: ApiErrorClass | Error): Record<string, any> {
  const sensitiveKeys = [
    'token',
    'password',
    'secret',
    'authorization',
    'cookie',
    'access_token',
    'refresh_token',
    'client_secret',
    'jwt'
  ]

  const sanitized: Record<string, any> = {
    name: error.name,
    message: error.message,
    stack: error.stack
  }

  if (error instanceof ApiErrorClass) {
    sanitized.code = error.code
    sanitized.statusCode = error.statusCode

    // Sanitize details if present
    if (error.details) {
      sanitized.details = sanitizeObject(error.details, sensitiveKeys)
    }
  }

  return sanitized
}

/**
 * Recursively sanitizes an object by removing sensitive keys
 * Requirements: 7.6
 */
function sanitizeObject(obj: any, sensitiveKeys: string[]): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, sensitiveKeys))
  }

  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase()
    
    // Check if key contains sensitive information
    const isSensitive = sensitiveKeys.some(sensitiveKey => 
      lowerKey.includes(sensitiveKey.toLowerCase())
    )

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, sensitiveKeys)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Logs error with sanitization
 * Requirements: 7.6
 */
export function logError(error: ApiErrorClass | Error, context?: Record<string, any>): void {
  const sanitizedError = sanitizeErrorForLogging(error)
  const sanitizedContext = context ? sanitizeObject(context, [
    'token',
    'password',
    'secret',
    'authorization',
    'cookie',
    'access_token',
    'refresh_token',
    'client_secret',
    'jwt'
  ]) : undefined

  console.error('Error occurred:', {
    error: sanitizedError,
    context: sanitizedContext,
    timestamp: new Date().toISOString()
  })
}

/**
 * Helper functions to create common errors
 * Requirements: 5.7
 */
export const createUnauthorizedError = (message = 'Unauthorized'): ApiErrorClass => 
  new ApiErrorClass(ErrorCode.UNAUTHORIZED, message)

export const createInvalidTokenError = (message = 'Invalid or expired token'): ApiErrorClass => 
  new ApiErrorClass(ErrorCode.INVALID_TOKEN, message)

export const createOAuthError = (message = 'OAuth authentication failed', details?: any): ApiErrorClass => 
  new ApiErrorClass(ErrorCode.OAUTH_FAILED, message, details)

export const createDatabaseError = (message = 'Database operation failed', details?: any): ApiErrorClass => 
  new ApiErrorClass(ErrorCode.DATABASE_ERROR, message, details)

export const createValidationError = (message = 'Validation failed', details?: any): ApiErrorClass => 
  new ApiErrorClass(ErrorCode.VALIDATION_ERROR, message, details)

export const createNotFoundError = (message = 'Resource not found'): ApiErrorClass => 
  new ApiErrorClass(ErrorCode.NOT_FOUND, message)

export const createInternalError = (message = 'Internal server error', details?: any): ApiErrorClass => 
  new ApiErrorClass(ErrorCode.INTERNAL_ERROR, message, details)
