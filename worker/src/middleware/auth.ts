/**
 * Authentication middleware
 * Handles JWT extraction, validation, and user context attachment
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import { verifyToken } from '../services/jwt'
import { createUnauthorizedError, createInvalidTokenError, logError } from '../utils/errors'
import type { Env, AuthenticatedRequest } from '../types'

/**
 * Extract JWT token from Authorization header
 * Requirements: 3.1
 * 
 * @param request - Incoming request
 * @returns JWT token string or null if not found
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader) {
    return null
  }
  
  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ')
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

/**
 * Authentication middleware that validates JWT and attaches user to context
 * Requirements: 3.1, 3.2, 3.3, 3.4
 * 
 * @param request - Incoming request
 * @param env - Environment bindings
 * @returns Authenticated user context
 * @throws ApiErrorClass with 401 status for invalid/missing tokens
 */
export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<AuthenticatedRequest> {
  // Extract token from Authorization header
  const token = extractToken(request)
  
  if (!token) {
    throw createUnauthorizedError('Missing authentication token')
  }
  
  try {
    // Validate token using JWT service
    const payload = await verifyToken(token, env.JWT_SECRET)
    
    // Attach user info to request context
    return {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name
      }
    }
  } catch (error) {
    // Log error for debugging (token will be sanitized)
    logError(error as Error, { path: request.url })
    
    // Return 401 for invalid/expired tokens
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        throw createInvalidTokenError('Token has expired')
      }
      if (error.message.includes('signature')) {
        throw createInvalidTokenError('Invalid token signature')
      }
      throw createInvalidTokenError('Token validation failed')
    }
    
    throw createInvalidTokenError('Invalid authentication token')
  }
}
