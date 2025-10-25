/**
 * OAuth service for Google authentication
 * Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 7.2, 7.3
 */

import { GoogleTokenResponse, GoogleUserInfo, ErrorCode } from '../types'

/**
 * Generate a random state parameter for CSRF protection
 * Requirements: 1.1, 7.2
 */
function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate Google OAuth authorization URL
 * Requirements: 1.1, 7.2
 * 
 * @param clientId - Google OAuth client ID
 * @param redirectUri - Callback URL after authentication
 * @returns Object containing authorization URL and state parameter
 */
export function generateAuthorizationUrl(
  clientId: string,
  redirectUri: string
): { url: string; state: string } {
  const state = generateState()
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: state,
    access_type: 'online',
    prompt: 'select_account'
  })
  
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  
  return { url, state }
}

/**
 * Exchange authorization code for access token
 * Requirements: 1.2, 2.1, 7.3
 * 
 * @param code - Authorization code from Google
 * @param clientId - Google OAuth client ID
 * @param clientSecret - Google OAuth client secret
 * @param redirectUri - Callback URL (must match the one used in authorization)
 * @returns Google token response with access token
 * @throws Error if token exchange fails
 */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<GoogleTokenResponse> {
  const tokenEndpoint = 'https://oauth2.googleapis.com/token'
  
  const body = new URLSearchParams({
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  })
  
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Token exchange failed: ${response.status} - ${JSON.stringify(errorData)}`)
    }
    
    const data = await response.json() as GoogleTokenResponse
    
    // Validate required fields
    if (!data.access_token) {
      throw new Error('Invalid token response: missing access_token')
    }
    
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OAuth token exchange failed: ${error.message}`)
    }
    throw new Error('OAuth token exchange failed: Unknown error')
  }
}

/**
 * Fetch user profile from Google
 * Requirements: 1.3, 2.2
 * 
 * @param accessToken - Google access token
 * @returns User profile information from Google
 * @throws Error if profile fetch fails
 */
export async function fetchUserProfile(accessToken: string): Promise<GoogleUserInfo> {
  const userinfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo'
  
  try {
    const response = await fetch(userinfoEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Profile fetch failed: ${response.status} - ${JSON.stringify(errorData)}`)
    }
    
    const data = await response.json() as GoogleUserInfo
    
    // Validate required fields
    if (!data.id || !data.email || !data.name) {
      throw new Error('Invalid profile response: missing required fields')
    }
    
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`)
    }
    throw new Error('Failed to fetch user profile: Unknown error')
  }
}

/**
 * Validate state parameter to prevent CSRF attacks
 * Requirements: 7.2
 * 
 * @param receivedState - State parameter received from OAuth callback
 * @param expectedState - State parameter that was originally sent
 * @returns true if states match, false otherwise
 */
export function validateState(receivedState: string, expectedState: string): boolean {
  if (!receivedState || !expectedState) {
    return false
  }
  return receivedState === expectedState
}
