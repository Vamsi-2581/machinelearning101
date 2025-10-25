# Requirements Document

## Introduction

This feature adds backend authentication capabilities to the Machine Learning Simplified platform using Cloudflare Workers and Google OAuth. Currently, the platform is entirely client-side with no user authentication system. This enhancement will enable user accounts, secure authentication via Google, and personalized experiences while maintaining the platform's zero-setup philosophy for learners. The backend will be serverless, leveraging Cloudflare Workers for edge computing and Cloudflare D1 for data persistence.

## Requirements

### Requirement 1: Google OAuth Integration

**User Story:** As a new user, I want to sign in with my Google account, so that I can quickly access the platform without creating new credentials.

#### Acceptance Criteria

1. WHEN a user clicks "Sign in with Google" THEN the system SHALL redirect to Google's OAuth consent screen
2. WHEN Google OAuth returns an authorization code THEN the system SHALL exchange it for user profile information
3. WHEN a user authenticates via Google for the first time THEN the system SHALL create a new user account with their Google profile data
4. WHEN a user authenticates via Google with an existing account THEN the system SHALL log them in to their existing account
5. WHEN OAuth authentication succeeds THEN the system SHALL return a JWT token for session management
6. WHEN OAuth authentication fails THEN the system SHALL display an appropriate error message to the user

### Requirement 2: OAuth Callback Handling

**User Story:** As a user completing Google authentication, I want to be seamlessly redirected back to the platform, so that my login experience is smooth and uninterrupted.

#### Acceptance Criteria

1. WHEN Google redirects back with an authorization code THEN the system SHALL validate the code with Google's token endpoint
2. WHEN the authorization code is valid THEN the system SHALL retrieve the user's Google profile (email, name, picture)
3. WHEN user profile data is retrieved THEN the system SHALL create or update the user record in the database
4. WHEN the user record is created/updated THEN the system SHALL generate a JWT token
5. WHEN the JWT token is generated THEN the system SHALL redirect the user to the frontend with the token
6. WHEN OAuth callback fails THEN the system SHALL redirect to the frontend with an error parameter

### Requirement 3: Token-Based Authentication

**User Story:** As an authenticated user, I want my session to persist securely, so that I don't have to log in repeatedly during normal usage.

#### Acceptance Criteria

1. WHEN a user makes an authenticated request THEN the system SHALL validate the JWT token from the Authorization header
2. WHEN a JWT token is expired THEN the system SHALL return a 401 Unauthorized error
3. WHEN a JWT token is invalid or tampered THEN the system SHALL return a 401 Unauthorized error
4. WHEN a valid JWT token is provided THEN the system SHALL extract user information and attach it to the request context
5. WHEN a user logs out THEN the client SHALL remove the JWT token from storage

### Requirement 4: Progress Data Synchronization

**User Story:** As an authenticated user, I want my learning progress automatically saved to the cloud, so that I can continue learning from any device.

#### Acceptance Criteria

1. WHEN an authenticated user completes a module THEN the system SHALL save the completion status to the user's profile
2. WHEN an authenticated user completes a quiz THEN the system SHALL save the quiz score and timestamp
3. WHEN an authenticated user bookmarks a module THEN the system SHALL save the bookmark to their profile
4. WHEN an authenticated user requests their progress data THEN the system SHALL return all saved progress, quiz scores, and bookmarks
5. WHEN progress data is saved THEN the system SHALL include a timestamp for each entry
6. WHEN a conflict occurs between local and cloud data THEN the system SHALL use the most recent timestamp

### Requirement 5: Cloudflare Workers API Endpoints

**User Story:** As a developer, I want well-structured API endpoints, so that the frontend can reliably communicate with the authentication backend.

#### Acceptance Criteria

1. WHEN the API receives a GET request to /api/auth/google THEN the system SHALL redirect to Google OAuth consent screen
2. WHEN the API receives a GET request to /api/auth/google/callback THEN the system SHALL process the OAuth callback
3. WHEN the API receives a GET request to /api/auth/me THEN the system SHALL return the authenticated user's profile
4. WHEN the API receives a POST request to /api/auth/logout THEN the system SHALL invalidate the user's session
5. WHEN the API receives a POST request to /api/progress/sync THEN the system SHALL save user progress data
6. WHEN the API receives a GET request to /api/progress THEN the system SHALL return the user's progress data
7. WHEN any API endpoint encounters an error THEN the system SHALL return appropriate HTTP status codes and error messages
8. WHEN the API receives requests THEN the system SHALL include CORS headers for the frontend domain

### Requirement 6: Database Schema and Storage

**User Story:** As a system administrator, I want a well-designed database schema, so that user data is stored efficiently and securely.

#### Acceptance Criteria

1. WHEN the system initializes THEN the database SHALL have a users table with fields: id, google_id, email, name, picture_url, created_at, updated_at
2. WHEN the system initializes THEN the database SHALL have a progress table with fields: id, user_id, module_id, completed, completed_at
3. WHEN the system initializes THEN the database SHALL have a quiz_scores table with fields: id, user_id, module_id, score, total, completed_at
4. WHEN the system initializes THEN the database SHALL have a bookmarks table with fields: id, user_id, module_id, created_at
5. WHEN a user is deleted THEN the system SHALL cascade delete all related progress, quiz scores, and bookmarks
6. WHEN querying user data THEN the system SHALL use indexed fields (google_id, email) for optimal performance

### Requirement 7: Security and Data Protection

**User Story:** As a user, I want my personal data protected, so that my account and learning history remain secure.

#### Acceptance Criteria

1. WHEN generating JWT tokens THEN the system SHALL use a secure secret key stored in environment variables
2. WHEN validating OAuth responses THEN the system SHALL verify the state parameter to prevent CSRF attacks
3. WHEN exchanging authorization codes THEN the system SHALL validate the code with Google's servers
4. WHEN processing requests THEN the system SHALL validate and sanitize all input data
5. WHEN a SQL query is constructed THEN the system SHALL use parameterized queries to prevent SQL injection
6. WHEN sensitive data is logged THEN the system SHALL exclude tokens and OAuth secrets from logs
7. WHEN storing OAuth credentials THEN the system SHALL keep client secrets in environment variables only

### Requirement 8: Frontend Integration

**User Story:** As a user, I want seamless authentication in the UI, so that logging in and managing my account feels natural and intuitive.

#### Acceptance Criteria

1. WHEN a user is not authenticated THEN the system SHALL display a "Sign in with Google" button in the header
2. WHEN a user is authenticated THEN the system SHALL display the user's name, profile picture, and a logout button
3. WHEN a user clicks "Sign in with Google" THEN the system SHALL redirect to the OAuth flow
4. WHEN OAuth completes successfully THEN the system SHALL store the JWT token in localStorage
5. WHEN a user logs out THEN the system SHALL clear the JWT token and redirect to the home page
6. WHEN an API request fails with 401 THEN the system SHALL automatically log out the user
7. WHEN a user completes a module or quiz THEN the system SHALL automatically sync progress if authenticated
8. WHEN a user is not authenticated THEN the system SHALL still allow full access to learning modules with local-only progress tracking
