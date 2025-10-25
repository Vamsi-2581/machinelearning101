/**
 * Unit tests for error handling utilities
 * Requirements: 5.7, 7.6
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  ApiErrorClass,
  errorCodeToHttpStatus,
  formatErrorResponse,
  createErrorResponse,
  sanitizeErrorForLogging,
  logError,
  createUnauthorizedError,
  createInvalidTokenError,
  createOAuthError,
  createDatabaseError,
  createValidationError,
  createNotFoundError,
  createInternalError
} from '../../src/utils/errors'
import { ErrorCode } from '../../src/types'

describe('Error Utilities', () => {
  describe('ApiErrorClass', () => {
    it('should create an error with correct properties', () => {
      const error = new ApiErrorClass(
        ErrorCode.VALIDATION_ERROR,
        'Invalid input',
        { field: 'email' }
      )

      expect(error.name).toBe('ApiError')
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR)
      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
      expect(error.details).toEqual({ field: 'email' })
      expect(error.stack).toBeDefined()
    })

    it('should create an error without details', () => {
      const error = new ApiErrorClass(
        ErrorCode.UNAUTHORIZED,
        'Not authorized'
      )

      expect(error.code).toBe(ErrorCode.UNAUTHORIZED)
      expect(error.message).toBe('Not authorized')
      expect(error.statusCode).toBe(401)
      expect(error.details).toBeUndefined()
    })
  })

  describe('errorCodeToHttpStatus', () => {
    it('should map UNAUTHORIZED to 401', () => {
      expect(errorCodeToHttpStatus(ErrorCode.UNAUTHORIZED)).toBe(401)
    })

    it('should map INVALID_TOKEN to 401', () => {
      expect(errorCodeToHttpStatus(ErrorCode.INVALID_TOKEN)).toBe(401)
    })

    it('should map OAUTH_FAILED to 400', () => {
      expect(errorCodeToHttpStatus(ErrorCode.OAUTH_FAILED)).toBe(400)
    })

    it('should map DATABASE_ERROR to 500', () => {
      expect(errorCodeToHttpStatus(ErrorCode.DATABASE_ERROR)).toBe(500)
    })

    it('should map VALIDATION_ERROR to 400', () => {
      expect(errorCodeToHttpStatus(ErrorCode.VALIDATION_ERROR)).toBe(400)
    })

    it('should map NOT_FOUND to 404', () => {
      expect(errorCodeToHttpStatus(ErrorCode.NOT_FOUND)).toBe(404)
    })

    it('should map INTERNAL_ERROR to 500', () => {
      expect(errorCodeToHttpStatus(ErrorCode.INTERNAL_ERROR)).toBe(500)
    })
  })

  describe('formatErrorResponse', () => {
    it('should format ApiErrorClass correctly', () => {
      const error = new ApiErrorClass(
        ErrorCode.VALIDATION_ERROR,
        'Invalid email',
        { field: 'email', value: 'invalid' }
      )

      const formatted = formatErrorResponse(error)

      expect(formatted).toEqual({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid email',
        details: { field: 'email', value: 'invalid' }
      })
    })

    it('should format ApiErrorClass without details', () => {
      const error = new ApiErrorClass(
        ErrorCode.UNAUTHORIZED,
        'Not authorized'
      )

      const formatted = formatErrorResponse(error)

      expect(formatted).toEqual({
        code: ErrorCode.UNAUTHORIZED,
        message: 'Not authorized',
        details: undefined
      })
    })

    it('should format generic Error as INTERNAL_ERROR', () => {
      const error = new Error('Something went wrong')

      const formatted = formatErrorResponse(error)

      expect(formatted).toEqual({
        code: ErrorCode.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
        details: undefined
      })
    })
  })

  describe('createErrorResponse', () => {
    it('should create Response with correct status and body for ApiErrorClass', () => {
      const error = new ApiErrorClass(
        ErrorCode.NOT_FOUND,
        'User not found'
      )

      const response = createErrorResponse(error)

      expect(response.status).toBe(404)
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('should create Response with 500 status for generic Error', () => {
      const error = new Error('Unexpected error')

      const response = createErrorResponse(error)

      expect(response.status).toBe(500)
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('should include error details in response body', async () => {
      const error = new ApiErrorClass(
        ErrorCode.VALIDATION_ERROR,
        'Invalid input',
        { field: 'email' }
      )

      const response = createErrorResponse(error)
      const body = await response.json()

      expect(body).toEqual({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid input',
        details: { field: 'email' }
      })
    })
  })

  describe('sanitizeErrorForLogging', () => {
    it('should sanitize ApiErrorClass with sensitive data in details', () => {
      const error = new ApiErrorClass(
        ErrorCode.OAUTH_FAILED,
        'OAuth failed',
        {
          access_token: 'secret-token',
          user: 'john@example.com',
          client_secret: 'very-secret'
        }
      )

      const sanitized = sanitizeErrorForLogging(error)

      expect(sanitized.name).toBe('ApiError')
      expect(sanitized.message).toBe('OAuth failed')
      expect(sanitized.code).toBe(ErrorCode.OAUTH_FAILED)
      expect(sanitized.statusCode).toBe(400)
      expect(sanitized.details.access_token).toBe('[REDACTED]')
      expect(sanitized.details.client_secret).toBe('[REDACTED]')
      expect(sanitized.details.user).toBe('john@example.com')
    })

    it('should sanitize nested sensitive data', () => {
      const error = new ApiErrorClass(
        ErrorCode.DATABASE_ERROR,
        'Query failed',
        {
          query: 'SELECT * FROM users',
          params: {
            token: 'secret-jwt',
            email: 'user@example.com'
          }
        }
      )

      const sanitized = sanitizeErrorForLogging(error)

      expect(sanitized.details.query).toBe('SELECT * FROM users')
      expect(sanitized.details.params.token).toBe('[REDACTED]')
      expect(sanitized.details.params.email).toBe('user@example.com')
    })

    it('should sanitize arrays with sensitive data', () => {
      const error = new ApiErrorClass(
        ErrorCode.VALIDATION_ERROR,
        'Multiple errors',
        {
          errors: [
            { field: 'email', password: 'secret123' },
            { field: 'name', token: 'jwt-token', value: 'test' }
          ]
        }
      )

      const sanitized = sanitizeErrorForLogging(error)

      expect(sanitized.details.errors[0].field).toBe('email')
      expect(sanitized.details.errors[0].password).toBe('[REDACTED]')
      expect(sanitized.details.errors[1].field).toBe('name')
      expect(sanitized.details.errors[1].token).toBe('[REDACTED]')
      expect(sanitized.details.errors[1].value).toBe('test')
    })

    it('should handle generic Error', () => {
      const error = new Error('Generic error')

      const sanitized = sanitizeErrorForLogging(error)

      expect(sanitized.name).toBe('Error')
      expect(sanitized.message).toBe('Generic error')
      expect(sanitized.stack).toBeDefined()
      expect(sanitized.code).toBeUndefined()
    })

    it('should redact all common sensitive keys', () => {
      const error = new ApiErrorClass(
        ErrorCode.INTERNAL_ERROR,
        'Error',
        {
          token: 'token-value',
          password: 'password-value',
          secret: 'secret-value',
          authorization: 'auth-value',
          cookie: 'cookie-value',
          access_token: 'access-value',
          refresh_token: 'refresh-value',
          client_secret: 'client-value',
          jwt: 'jwt-value',
          normalField: 'normal-value'
        }
      )

      const sanitized = sanitizeErrorForLogging(error)

      expect(sanitized.details.token).toBe('[REDACTED]')
      expect(sanitized.details.password).toBe('[REDACTED]')
      expect(sanitized.details.secret).toBe('[REDACTED]')
      expect(sanitized.details.authorization).toBe('[REDACTED]')
      expect(sanitized.details.cookie).toBe('[REDACTED]')
      expect(sanitized.details.access_token).toBe('[REDACTED]')
      expect(sanitized.details.refresh_token).toBe('[REDACTED]')
      expect(sanitized.details.client_secret).toBe('[REDACTED]')
      expect(sanitized.details.jwt).toBe('[REDACTED]')
      expect(sanitized.details.normalField).toBe('normal-value')
    })

    it('should handle null and undefined values', () => {
      const error = new ApiErrorClass(
        ErrorCode.VALIDATION_ERROR,
        'Error',
        {
          nullValue: null,
          undefinedValue: undefined,
          normalValue: 'test'
        }
      )

      const sanitized = sanitizeErrorForLogging(error)

      expect(sanitized.details.nullValue).toBeNull()
      expect(sanitized.details.undefinedValue).toBeUndefined()
      expect(sanitized.details.normalValue).toBe('test')
    })
  })

  describe('logError', () => {
    let consoleErrorSpy: any

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleErrorSpy.mockRestore()
    })

    it('should log error with sanitized data', () => {
      const error = new ApiErrorClass(
        ErrorCode.OAUTH_FAILED,
        'OAuth failed',
        { access_token: 'secret' }
      )

      logError(error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          error: expect.objectContaining({
            name: 'ApiError',
            message: 'OAuth failed',
            code: ErrorCode.OAUTH_FAILED,
            details: { access_token: '[REDACTED]' }
          }),
          timestamp: expect.any(String)
        })
      )
    })

    it('should log error with sanitized context', () => {
      const error = new ApiErrorClass(ErrorCode.DATABASE_ERROR, 'DB error')
      const context = {
        userId: '123',
        token: 'secret-token',
        action: 'update'
      }

      logError(error, context)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          error: expect.any(Object),
          context: {
            userId: '123',
            token: '[REDACTED]',
            action: 'update'
          },
          timestamp: expect.any(String)
        })
      )
    })

    it('should log error without context', () => {
      const error = new Error('Generic error')

      logError(error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          error: expect.objectContaining({
            name: 'Error',
            message: 'Generic error'
          }),
          context: undefined,
          timestamp: expect.any(String)
        })
      )
    })
  })

  describe('Helper functions', () => {
    it('should create unauthorized error', () => {
      const error = createUnauthorizedError()

      expect(error.code).toBe(ErrorCode.UNAUTHORIZED)
      expect(error.message).toBe('Unauthorized')
      expect(error.statusCode).toBe(401)
    })

    it('should create unauthorized error with custom message', () => {
      const error = createUnauthorizedError('Access denied')

      expect(error.code).toBe(ErrorCode.UNAUTHORIZED)
      expect(error.message).toBe('Access denied')
    })

    it('should create invalid token error', () => {
      const error = createInvalidTokenError()

      expect(error.code).toBe(ErrorCode.INVALID_TOKEN)
      expect(error.message).toBe('Invalid or expired token')
      expect(error.statusCode).toBe(401)
    })

    it('should create OAuth error with details', () => {
      const error = createOAuthError('Failed to exchange code', { code: 'invalid_grant' })

      expect(error.code).toBe(ErrorCode.OAUTH_FAILED)
      expect(error.message).toBe('Failed to exchange code')
      expect(error.details).toEqual({ code: 'invalid_grant' })
      expect(error.statusCode).toBe(400)
    })

    it('should create database error', () => {
      const error = createDatabaseError('Connection failed', { host: 'localhost' })

      expect(error.code).toBe(ErrorCode.DATABASE_ERROR)
      expect(error.message).toBe('Connection failed')
      expect(error.details).toEqual({ host: 'localhost' })
      expect(error.statusCode).toBe(500)
    })

    it('should create validation error', () => {
      const error = createValidationError('Invalid email', { field: 'email' })

      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR)
      expect(error.message).toBe('Invalid email')
      expect(error.details).toEqual({ field: 'email' })
      expect(error.statusCode).toBe(400)
    })

    it('should create not found error', () => {
      const error = createNotFoundError('User not found')

      expect(error.code).toBe(ErrorCode.NOT_FOUND)
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
    })

    it('should create internal error', () => {
      const error = createInternalError('Unexpected error', { trace: 'stack' })

      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR)
      expect(error.message).toBe('Unexpected error')
      expect(error.details).toEqual({ trace: 'stack' })
      expect(error.statusCode).toBe(500)
    })
  })
})
