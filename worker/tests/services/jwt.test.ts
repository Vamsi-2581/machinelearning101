/**
 * JWT Service Unit Tests
 * Requirements: 3.1, 3.2, 3.3, 7.1
 */

import { describe, it, expect } from 'vitest'
import { generateToken, verifyToken } from '../../src/services/jwt'

describe('JWT Service', () => {
  const TEST_SECRET = 'test-secret-key-for-jwt-signing'
  const TEST_USER = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  describe('generateToken', () => {
    it('should generate a valid JWT token with correct payload', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should include user id, email, and name in payload', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      const payload = await verifyToken(token, TEST_SECRET)

      expect(payload.sub).toBe(TEST_USER.id)
      expect(payload.email).toBe(TEST_USER.email)
      expect(payload.name).toBe(TEST_USER.name)
    })

    it('should set issued at (iat) timestamp', async () => {
      const beforeGeneration = Math.floor(Date.now() / 1000)
      
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      const payload = await verifyToken(token, TEST_SECRET)
      const afterGeneration = Math.floor(Date.now() / 1000)

      expect(payload.iat).toBeDefined()
      expect(payload.iat).toBeGreaterThanOrEqual(beforeGeneration)
      expect(payload.iat).toBeLessThanOrEqual(afterGeneration)
    })

    it('should set 7-day expiration', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      const payload = await verifyToken(token, TEST_SECRET)
      const expectedExpiration = payload.iat + (7 * 24 * 60 * 60)

      expect(payload.exp).toBe(expectedExpiration)
    })

    it('should generate different tokens for different users', async () => {
      const token1 = await generateToken(
        'user-1',
        'user1@example.com',
        'User One',
        TEST_SECRET
      )

      const token2 = await generateToken(
        'user-2',
        'user2@example.com',
        'User Two',
        TEST_SECRET
      )

      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyToken', () => {
    it('should successfully verify a valid token', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      const payload = await verifyToken(token, TEST_SECRET)

      expect(payload).toBeDefined()
      expect(payload.sub).toBe(TEST_USER.id)
      expect(payload.email).toBe(TEST_USER.email)
      expect(payload.name).toBe(TEST_USER.name)
    })

    it('should extract and return complete payload', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      const payload = await verifyToken(token, TEST_SECRET)

      expect(payload).toHaveProperty('sub')
      expect(payload).toHaveProperty('email')
      expect(payload).toHaveProperty('name')
      expect(payload).toHaveProperty('iat')
      expect(payload).toHaveProperty('exp')
    })

    it('should reject token with invalid signature', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      const wrongSecret = 'wrong-secret-key'

      await expect(verifyToken(token, wrongSecret)).rejects.toThrow()
    })

    it('should reject malformed token', async () => {
      const malformedToken = 'not.a.valid.jwt.token'

      await expect(verifyToken(malformedToken, TEST_SECRET)).rejects.toThrow()
    })

    it('should reject token with missing parts', async () => {
      const incompleteToken = 'header.payload'

      await expect(verifyToken(incompleteToken, TEST_SECRET)).rejects.toThrow()
    })

    it('should reject expired token', async () => {
      // Create a token that expires immediately
      const { SignJWT } = await import('jose')
      const encoder = new TextEncoder()
      const secretKey = encoder.encode(TEST_SECRET)
      
      const now = Math.floor(Date.now() / 1000)
      const expiredToken = await new SignJWT({
        sub: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt(now - 10)
        .setExpirationTime(now - 5) // Expired 5 seconds ago
        .sign(secretKey)

      await expect(verifyToken(expiredToken, TEST_SECRET)).rejects.toThrow('expired')
    })

    it('should handle token with missing required fields', async () => {
      // Create a token without required fields
      const { SignJWT } = await import('jose')
      const encoder = new TextEncoder()
      const secretKey = encoder.encode(TEST_SECRET)
      
      const now = Math.floor(Date.now() / 1000)
      const invalidToken = await new SignJWT({
        sub: TEST_USER.id,
        // Missing email and name
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt(now)
        .setExpirationTime(now + 3600)
        .sign(secretKey)

      await expect(verifyToken(invalidToken, TEST_SECRET)).rejects.toThrow('missing required fields')
    })

    it('should verify signature correctly', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      // Should not throw with correct secret
      await expect(verifyToken(token, TEST_SECRET)).resolves.toBeDefined()

      // Should throw with incorrect secret
      await expect(verifyToken(token, 'different-secret')).rejects.toThrow()
    })

    it('should handle empty token string', async () => {
      await expect(verifyToken('', TEST_SECRET)).rejects.toThrow()
    })

    it('should handle token with tampered payload', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      // Tamper with the token by modifying the payload part
      const parts = token.split('.')
      const tamperedPayload = Buffer.from(
        JSON.stringify({ sub: 'hacker', email: 'hacker@evil.com', name: 'Hacker' })
      ).toString('base64url')
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`

      await expect(verifyToken(tamperedToken, TEST_SECRET)).rejects.toThrow()
    })
  })

  describe('Token lifecycle', () => {
    it('should create and verify token in complete flow', async () => {
      // Generate token
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      // Verify token
      const payload = await verifyToken(token, TEST_SECRET)

      // Validate payload matches original data
      expect(payload.sub).toBe(TEST_USER.id)
      expect(payload.email).toBe(TEST_USER.email)
      expect(payload.name).toBe(TEST_USER.name)
      expect(payload.iat).toBeDefined()
      expect(payload.exp).toBeDefined()
      expect(payload.exp).toBeGreaterThan(payload.iat)
    })

    it('should maintain token integrity across multiple verifications', async () => {
      const token = await generateToken(
        TEST_USER.id,
        TEST_USER.email,
        TEST_USER.name,
        TEST_SECRET
      )

      // Verify multiple times
      const payload1 = await verifyToken(token, TEST_SECRET)
      const payload2 = await verifyToken(token, TEST_SECRET)
      const payload3 = await verifyToken(token, TEST_SECRET)

      // All verifications should return same data
      expect(payload1).toEqual(payload2)
      expect(payload2).toEqual(payload3)
    })
  })
})
