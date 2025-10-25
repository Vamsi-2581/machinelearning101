/**
 * JWT Service
 * Handles JWT token generation and validation using jose library
 * Requirements: 1.5, 3.1, 3.2, 3.3, 3.4, 7.1
 */

import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from '../types'

/**
 * Generate a JWT token for authenticated user
 * Requirements: 1.5, 3.4, 7.1
 * 
 * @param userId - User's unique identifier
 * @param email - User's email address
 * @param name - User's display name
 * @param secret - JWT secret key from environment
 * @returns Signed JWT token string
 */
export async function generateToken(
  userId: string,
  email: string,
  name: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(secret)
  
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 7 * 24 * 60 * 60 // 7 days in seconds
  
  const token = await new SignJWT({
    sub: userId,
    email,
    name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(secretKey)
  
  return token
}

/**
 * Verify and decode a JWT token
 * Requirements: 3.1, 3.2, 3.3, 7.1
 * 
 * @param token - JWT token string to verify
 * @param secret - JWT secret key from environment
 * @returns Decoded JWT payload
 * @throws Error if token is invalid, expired, or signature verification fails
 */
export async function verifyToken(
  token: string,
  secret: string
): Promise<JWTPayload> {
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(secret)
  
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    })
    
    // Validate required fields
    if (!payload.sub || !payload.email || !payload.name) {
      throw new Error('Invalid token payload: missing required fields')
    }
    
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      iat: payload.iat as number,
      exp: payload.exp as number,
    }
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific JWT errors
      if (error.message.includes('expired') || error.message.includes('"exp" claim')) {
        throw new Error('Token has expired')
      }
      if (error.message.includes('signature')) {
        throw new Error('Invalid token signature')
      }
      throw new Error(`Token validation failed: ${error.message}`)
    }
    throw new Error('Token validation failed')
  }
}
