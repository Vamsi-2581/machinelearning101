/**
 * Authentication handlers
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.5, 5.1, 5.2, 5.3, 5.4, 7.2, 7.3
 */

import { generateAuthorizationUrl, exchangeCodeForToken, fetchUserProfile, validateState } from '../services/oauth'
import { generateToken } from '../services/jwt'
import { createUser, getUserByGoogleId, updateUser, getUserById } from '../services/database'
import { authenticateRequest } from '../middleware/auth'
import { createOAuthError, createNotFoundError, createInternalError, logError } from '../utils/errors'
import type { Env, UserProfileResponse, LogoutResponse } from '../types'

/**
 * Google OAuth initiation handler
 * Requirements: 1.1, 5.1, 7.2
 * 
 * Generates state parameter, stores it in cookie, and redirects to Google OAuth
 * 
 * @param request - Incoming request
 * @param env - Environment bindings
 * @returns Response with redirect to Google OAuth
 */
export async function handleGoogleOAuthInitiation(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Generate OAuth URL with state parameter
    const result = generateAuthorizationUrl(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_REDIRECT_URI
    )
    
    const { url, state } = result
    
    // Store state in cookie for validation in callback
    // Cookie expires in 10 minutes (OAuth flow should complete quickly)
    const cookieExpiry = new Date(Date.now() + 10 * 60 * 1000).toUTCString()
    
    // Create response with redirect and cookie
    const response = new Response(null, {
      status: 302,
      headers: {
        'Location': url,
        'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${cookieExpiry}`
      }
    })
    
    return response
  } catch (error) {
    logError(error as Error, { handler: 'handleGoogleOAuthInitiation' })
    throw createOAuthError('Failed to initiate OAuth flow')
  }
}

/**
 * OAuth callback handler
 * Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.2, 7.2, 7.3
 * 
 * Handles OAuth callback from Google, validates state, exchanges code for tokens,
 * creates/updates user, generates JWT, and redirects to frontend
 * 
 * @param request - Incoming request with OAuth callback parameters
 * @param env - Environment bindings
 * @returns Response with redirect to frontend with JWT token or error
 */
export async function handleOAuthCallback(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Parse URL parameters
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const receivedState = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    // Check for OAuth errors from Google
    if (error) {
      logError(new Error(`OAuth error: ${error}`), { handler: 'handleOAuthCallback' })
      return Response.redirect(
        `${env.FRONTEND_URL}?auth_error=${encodeURIComponent(error)}`,
        302
      )
    }
    
    // Validate required parameters
    if (!code || !receivedState) {
      return Response.redirect(
        `${env.FRONTEND_URL}?auth_error=${encodeURIComponent('missing_parameters')}`,
        302
      )
    }
    
    // Extract state from cookie
    const cookies = request.headers.get('Cookie') || ''
    const stateCookie = cookies
      .split(';')
      .find(c => c.trim().startsWith('oauth_state='))
    const expectedState = stateCookie?.split('=')[1]
    
    // Validate state parameter to prevent CSRF
    if (!expectedState || !validateState(receivedState, expectedState)) {
      logError(new Error('State validation failed'), { 
        handler: 'handleOAuthCallback',
        receivedState: receivedState.substring(0, 10) + '...',
        hasExpectedState: !!expectedState
      })
      return Response.redirect(
        `${env.FRONTEND_URL}?auth_error=${encodeURIComponent('invalid_state')}`,
        302
      )
    }
    
    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(
      code,
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    )
    
    // Fetch user profile from Google
    const userProfile = await fetchUserProfile(tokenResponse.access_token)
    
    // Check if user exists in database
    let user = await getUserByGoogleId(env.ml_platform_db, userProfile.id)
    
    if (user) {
      // Update existing user with latest profile data
      user = await updateUser(env.ml_platform_db, user.id, {
        email: userProfile.email,
        name: userProfile.name,
        picture_url: userProfile.picture
      })
    } else {
      // Create new user
      user = await createUser(env.ml_platform_db, {
        google_id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        picture_url: userProfile.picture
      })
    }
    
    // Generate JWT token
    const jwtToken = await generateToken(
      user.id,
      user.email,
      user.name,
      env.JWT_SECRET
    )
    
    // Redirect to frontend with JWT token
    const redirectUrl = `${env.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(jwtToken)}`
    
    // Create response with redirect and clear state cookie
    const response = new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Set-Cookie': 'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
      }
    })
    
    return response
    
  } catch (error) {
    logError(error as Error, { handler: 'handleOAuthCallback' })
    
    // Redirect to frontend with error
    return Response.redirect(
      `${env.FRONTEND_URL}?auth_error=${encodeURIComponent('authentication_failed')}`,
      302
    )
  }
}

/**
 * User profile handler
 * Requirements: 5.3
 * 
 * Returns authenticated user's profile data
 * 
 * @param request - Incoming request with JWT token
 * @param env - Environment bindings
 * @returns Response with user profile data
 */
export async function handleGetUserProfile(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Validate JWT and get user context
    const authContext = await authenticateRequest(request, env)
    
    // Fetch user from database
    const user = await getUserById(env.ml_platform_db, authContext.user.id)
    
    console.log(JSON.stringify(user))
    if (!user) {
      throw createNotFoundError('User not found')
    }
    
    // Return user profile data
    const profileResponse: UserProfileResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      picture_url: user.picture_url
    }

    console.log(JSON.stringify(profileResponse))
    
    return new Response(JSON.stringify(profileResponse), {
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
    
    logError(error as Error, { handler: 'handleGetUserProfile' })
    throw createInternalError('Failed to fetch user profile')
  }
}

/**
 * Logout handler
 * Requirements: 3.5, 5.4
 * 
 * Returns success response (client handles token removal from localStorage)
 * 
 * @param request - Incoming request
 * @param env - Environment bindings
 * @returns Response with success status
 */
export async function handleLogout(
  request: Request,
  env: Env
): Promise<Response> {
  // Since we're using stateless JWT tokens, logout is handled client-side
  // by removing the token from localStorage. We just return a success response.
  
  const logoutResponse: LogoutResponse = {
    success: true
  }
  
  return new Response(JSON.stringify(logoutResponse), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
