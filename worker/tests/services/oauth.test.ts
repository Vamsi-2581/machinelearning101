/**
 * Unit tests for OAuth service
 * Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 7.2, 7.3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateAuthorizationUrl,
  exchangeCodeForToken,
  fetchUserProfile,
  validateState
} from '../../src/services/oauth'
import { GoogleTokenResponse, GoogleUserInfo } from '../../src/types'

describe('OAuth Service', () => {
  describe('generateAuthorizationUrl', () => {
    it('should generate a valid authorization URL with all required parameters', () => {
      // Requirements: 1.1, 7.2
      const clientId = 'test-client-id.apps.googleusercontent.com'
      const redirectUri = 'https://api.example.com/api/auth/google/callback'
      
      const result = generateAuthorizationUrl(clientId, redirectUri)
      
      expect(result).toHaveProperty('url')
      expect(result).toHaveProperty('state')
      expect(typeof result.url).toBe('string')
      expect(typeof result.state).toBe('string')
      
      const url = new URL(result.url)
      expect(url.origin).toBe('https://accounts.google.com')
      expect(url.pathname).toBe('/o/oauth2/v2/auth')
      
      const params = url.searchParams
      expect(params.get('client_id')).toBe(clientId)
      expect(params.get('redirect_uri')).toBe(redirectUri)
      expect(params.get('response_type')).toBe('code')
      expect(params.get('scope')).toBe('openid email profile')
      expect(params.get('state')).toBe(result.state)
      expect(params.get('access_type')).toBe('online')
      expect(params.get('prompt')).toBe('select_account')
    })
    
    it('should generate a unique state parameter each time', () => {
      // Requirements: 7.2
      const clientId = 'test-client-id'
      const redirectUri = 'https://api.example.com/callback'
      
      const result1 = generateAuthorizationUrl(clientId, redirectUri)
      const result2 = generateAuthorizationUrl(clientId, redirectUri)
      
      expect(result1.state).not.toBe(result2.state)
      expect(result1.state.length).toBeGreaterThan(0)
      expect(result2.state.length).toBeGreaterThan(0)
    })
    
    it('should generate a state parameter with sufficient entropy', () => {
      // Requirements: 7.2
      const clientId = 'test-client-id'
      const redirectUri = 'https://api.example.com/callback'
      
      const result = generateAuthorizationUrl(clientId, redirectUri)
      
      // State should be a hex string (64 characters for 32 bytes)
      expect(result.state).toMatch(/^[0-9a-f]{64}$/)
    })
  })
  
  describe('exchangeCodeForToken', () => {
    const mockFetch = vi.fn()
    
    beforeEach(() => {
      global.fetch = mockFetch
    })
    
    afterEach(() => {
      vi.clearAllMocks()
    })
    
    it('should successfully exchange authorization code for access token', async () => {
      // Requirements: 1.2, 2.1, 7.3
      const mockTokenResponse: GoogleTokenResponse = {
        access_token: 'mock-access-token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'openid email profile'
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse
      })
      
      const code = 'mock-auth-code'
      const clientId = 'test-client-id'
      const clientSecret = 'test-client-secret'
      const redirectUri = 'https://api.example.com/callback'
      
      const result = await exchangeCodeForToken(code, clientId, clientSecret, redirectUri)
      
      expect(result).toEqual(mockTokenResponse)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      
      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toBe('https://oauth2.googleapis.com/token')
      expect(options.method).toBe('POST')
      expect(options.headers['Content-Type']).toBe('application/x-www-form-urlencoded')
      
      const body = new URLSearchParams(options.body)
      expect(body.get('code')).toBe(code)
      expect(body.get('client_id')).toBe(clientId)
      expect(body.get('client_secret')).toBe(clientSecret)
      expect(body.get('redirect_uri')).toBe(redirectUri)
      expect(body.get('grant_type')).toBe('authorization_code')
    })
    
    it('should handle token exchange errors from Google', async () => {
      // Requirements: 2.1, 7.3
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'invalid_grant',
          error_description: 'Invalid authorization code'
        })
      })
      
      const code = 'invalid-code'
      const clientId = 'test-client-id'
      const clientSecret = 'test-client-secret'
      const redirectUri = 'https://api.example.com/callback'
      
      await expect(
        exchangeCodeForToken(code, clientId, clientSecret, redirectUri)
      ).rejects.toThrow('OAuth token exchange failed')
    })
    
    it('should handle network errors during token exchange', async () => {
      // Requirements: 2.1, 7.3
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      const code = 'mock-code'
      const clientId = 'test-client-id'
      const clientSecret = 'test-client-secret'
      const redirectUri = 'https://api.example.com/callback'
      
      await expect(
        exchangeCodeForToken(code, clientId, clientSecret, redirectUri)
      ).rejects.toThrow('OAuth token exchange failed')
    })
    
    it('should validate token response contains access_token', async () => {
      // Requirements: 2.1, 7.3
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expires_in: 3600,
          token_type: 'Bearer'
          // Missing access_token
        })
      })
      
      const code = 'mock-code'
      const clientId = 'test-client-id'
      const clientSecret = 'test-client-secret'
      const redirectUri = 'https://api.example.com/callback'
      
      await expect(
        exchangeCodeForToken(code, clientId, clientSecret, redirectUri)
      ).rejects.toThrow('Invalid token response: missing access_token')
    })
  })
  
  describe('fetchUserProfile', () => {
    const mockFetch = vi.fn()
    
    beforeEach(() => {
      global.fetch = mockFetch
    })
    
    afterEach(() => {
      vi.clearAllMocks()
    })
    
    it('should successfully fetch user profile from Google', async () => {
      // Requirements: 1.3, 2.2
      const mockUserInfo: GoogleUserInfo = {
        id: 'google-user-id-123',
        email: 'user@example.com',
        verified_email: true,
        name: 'Test User',
        given_name: 'Test',
        family_name: 'User',
        picture: 'https://example.com/photo.jpg'
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserInfo
      })
      
      const accessToken = 'mock-access-token'
      const result = await fetchUserProfile(accessToken)
      
      expect(result).toEqual(mockUserInfo)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      
      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toBe('https://www.googleapis.com/oauth2/v2/userinfo')
      expect(options.method).toBe('GET')
      expect(options.headers['Authorization']).toBe(`Bearer ${accessToken}`)
    })
    
    it('should handle profile fetch errors from Google', async () => {
      // Requirements: 2.2
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: {
            code: 401,
            message: 'Invalid Credentials'
          }
        })
      })
      
      const accessToken = 'invalid-token'
      
      await expect(
        fetchUserProfile(accessToken)
      ).rejects.toThrow('Failed to fetch user profile')
    })
    
    it('should handle network errors during profile fetch', async () => {
      // Requirements: 2.2
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      const accessToken = 'mock-token'
      
      await expect(
        fetchUserProfile(accessToken)
      ).rejects.toThrow('Failed to fetch user profile')
    })
    
    it('should validate profile response contains required fields', async () => {
      // Requirements: 1.3, 2.2
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'google-user-id',
          email: 'user@example.com'
          // Missing name
        })
      })
      
      const accessToken = 'mock-token'
      
      await expect(
        fetchUserProfile(accessToken)
      ).rejects.toThrow('Invalid profile response: missing required fields')
    })
    
    it('should extract email, name, and picture from profile', async () => {
      // Requirements: 1.3, 2.2
      const mockUserInfo: GoogleUserInfo = {
        id: 'google-123',
        email: 'john.doe@example.com',
        verified_email: true,
        name: 'John Doe',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://lh3.googleusercontent.com/photo.jpg'
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserInfo
      })
      
      const result = await fetchUserProfile('mock-token')
      
      expect(result.email).toBe('john.doe@example.com')
      expect(result.name).toBe('John Doe')
      expect(result.picture).toBe('https://lh3.googleusercontent.com/photo.jpg')
    })
  })
  
  describe('validateState', () => {
    it('should return true when states match', () => {
      // Requirements: 7.2
      const state = 'abc123def456'
      expect(validateState(state, state)).toBe(true)
    })
    
    it('should return false when states do not match', () => {
      // Requirements: 7.2
      const state1 = 'abc123def456'
      const state2 = 'xyz789ghi012'
      expect(validateState(state1, state2)).toBe(false)
    })
    
    it('should return false when received state is empty', () => {
      // Requirements: 7.2
      expect(validateState('', 'expected-state')).toBe(false)
    })
    
    it('should return false when expected state is empty', () => {
      // Requirements: 7.2
      expect(validateState('received-state', '')).toBe(false)
    })
    
    it('should return false when both states are empty', () => {
      // Requirements: 7.2
      expect(validateState('', '')).toBe(false)
    })
    
    it('should be case-sensitive', () => {
      // Requirements: 7.2
      expect(validateState('AbC123', 'abc123')).toBe(false)
    })
  })
})
