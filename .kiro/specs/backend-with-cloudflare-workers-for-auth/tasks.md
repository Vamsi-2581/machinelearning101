# Implementation Plan

- [x] 1. Set up Cloudflare Worker project structure
  - Create worker directory with TypeScript configuration
  - Initialize wrangler.toml with D1 database binding
  - Set up Vitest configuration for testing
  - Create directory structure (src/, tests/)
  - Add package.json with dependencies (hono, jose, vitest)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 2. Create database schema and migrations
  - Write schema.sql with users, progress, quiz_scores, and bookmarks tables
  - Add indexes for google_id, email, and user_id fields
  - Add foreign key constraints with cascade deletes
  - Create migration script for D1 database initialization
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 3. Implement core types and interfaces
  - Define User, Progress, QuizScore, Bookmark interfaces
  - Define JWTPayload interface
  - Define ApiError and ErrorCode types
  - Define OAuth response types
  - Define request/response types for all endpoints
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 4.1, 4.2, 4.3_

- [x] 4. Implement JWT service
- [x] 4.1 Create JWT generation function
  - Implement generateToken function using jose library
  - Include user id, email, name in payload
  - Set 7-day expiration
  - Use JWT_SECRET from environment
  - _Requirements: 1.5, 3.4, 7.1_

- [x] 4.2 Create JWT validation function
  - Implement verifyToken function
  - Validate signature and expiration
  - Extract and return payload
  - Handle invalid/expired tokens
  - _Requirements: 3.1, 3.2, 3.3, 7.1_

- [x] 4.3 Write unit tests for JWT service
  - Test token generation with correct payload
  - Test token validation with valid tokens
  - Test expired token handling
  - Test invalid token handling
  - Test signature verification
  - _Requirements: 3.1, 3.2, 3.3, 7.1_

- [x] 5. Implement OAuth service
- [x] 5.1 Create OAuth authorization URL generator
  - Generate random state parameter
  - Build Google OAuth URL with client_id, redirect_uri, scope
  - Include state parameter for CSRF protection
  - _Requirements: 1.1, 7.2_

- [x] 5.2 Create OAuth token exchange function
  - Exchange authorization code for access token
  - Call Google token endpoint with client_secret
  - Validate response from Google
  - Handle OAuth errors
  - _Requirements: 1.2, 2.1, 7.3_

- [x] 5.3 Create user profile fetching function
  - Call Google userinfo endpoint with access token
  - Extract email, name, picture from response
  - Return structured user profile data
  - _Requirements: 1.3, 2.2_

- [x] 5.4 Write unit tests for OAuth service
  - Test authorization URL generation
  - Test token exchange with mocked Google API
  - Test profile data extraction
  - Test error handling for failed requests
  - Test state parameter validation
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 7.2, 7.3_

- [x] 6. Implement database service
- [x] 6.1 Create user operations
  - Implement createUser function
  - Implement getUserByGoogleId function
  - Implement getUserById function
  - Implement updateUser function
  - Use parameterized queries for all operations
  - _Requirements: 1.3, 1.4, 2.3, 6.1, 7.5_

- [x] 6.2 Create progress operations
  - Implement saveProgress function (upsert)
  - Implement getProgressByUserId function
  - Use parameterized queries
  - _Requirements: 4.1, 4.4, 4.5, 6.2, 7.5_

- [x] 6.3 Create quiz score operations
  - Implement saveQuizScore function
  - Implement getQuizScoresByUserId function
  - Use parameterized queries
  - _Requirements: 4.2, 4.4, 4.5, 6.3, 7.5_

- [x] 6.4 Create bookmark operations
  - Implement saveBookmark function (upsert)
  - Implement getBookmarksByUserId function
  - Implement deleteBookmark function
  - Use parameterized queries
  - _Requirements: 4.3, 4.4, 4.5, 6.4, 7.5_

- [x] 6.5 Write unit tests for database service
  - Test user CRUD operations with mocked D1
  - Test progress operations
  - Test quiz score operations
  - Test bookmark operations
  - Test parameterized query usage
  - Test error handling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.5_

- [x] 7. Implement validation utilities
  - Create input sanitization functions
  - Create email validation function
  - Create module ID validation function
  - Create request body validation helpers
  - _Requirements: 7.4_

- [x] 7.1 Write unit tests for validation utilities
  - Test input sanitization
  - Test email validation
  - Test module ID validation
  - Test SQL injection prevention
  - _Requirements: 7.4, 7.5_

- [x] 8. Implement error handling utilities
  - Create ApiError class
  - Create error response formatter
  - Create error code to HTTP status mapper
  - Implement error logging (excluding sensitive data)
  - _Requirements: 5.7, 7.6_

- [x] 8.1 Write unit tests for error utilities
  - Test error response formatting
  - Test status code mapping
  - Test sensitive data exclusion from logs
  - _Requirements: 5.7, 7.6_

- [x] 9. Implement CORS middleware
  - Create CORS headers configuration
  - Implement preflight request handler
  - Add CORS headers to all responses
  - Validate origin against FRONTEND_URL
  - _Requirements: 5.8_

- [x] 9.1 Write unit tests for CORS middleware
  - Test CORS header application
  - Test preflight handling
  - Test origin validation
  - _Requirements: 5.8_

- [x] 10. Implement authentication middleware
- [x] 10.1 Create JWT extraction and validation middleware
  - Extract JWT from Authorization header
  - Validate token using JWT service
  - Attach user info to request context
  - Return 401 for invalid/missing tokens
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 10.2 Write unit tests for auth middleware
  - Test JWT extraction from headers
  - Test token validation
  - Test user context attachment
  - Test 401 response for invalid tokens
  - Test 401 response for missing tokens
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 11. Implement authentication handlers
- [x] 11.1 Create Google OAuth initiation handler
  - Generate state parameter
  - Store state in cookie or session
  - Build OAuth URL using OAuth service
  - Return 302 redirect to Google
  - _Requirements: 1.1, 5.1, 7.2_

- [x] 11.2 Create OAuth callback handler
  - Validate state parameter
  - Exchange code for tokens using OAuth service
  - Fetch user profile using OAuth service
  - Create or update user in database
  - Generate JWT token
  - Redirect to frontend with token
  - Handle errors and redirect with error parameter
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.2, 7.2, 7.3_

- [x] 11.3 Create user profile handler
  - Validate JWT using auth middleware
  - Fetch user from database
  - Return user profile data
  - _Requirements: 5.3_

- [x] 11.4 Create logout handler
  - Return success response (client handles token removal)
  - _Requirements: 3.5, 5.4_

- [x] 11.5 Write unit tests for auth handlers
  - Test OAuth initiation with state generation
  - Test callback processing with valid code
  - Test callback error handling
  - Test user profile retrieval
  - Test logout response
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.5, 5.1, 5.2, 5.3, 5.4_

- [x] 12. Implement progress sync handlers
- [x] 12.1 Create progress sync handler
  - Validate JWT using auth middleware
  - Validate request body
  - Save progress data using database service
  - Save quiz scores using database service
  - Save bookmarks using database service
  - Handle conflicts using timestamp comparison
  - Return success response with timestamp
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 5.5_

- [x] 12.2 Create progress retrieval handler
  - Validate JWT using auth middleware
  - Fetch progress data from database
  - Fetch quiz scores from database
  - Fetch bookmarks from database
  - Return combined progress data
  - _Requirements: 4.4, 5.6_

- [x] 12.3 Write unit tests for progress handlers
  - Test progress sync with valid data
  - Test progress retrieval
  - Test data validation
  - Test conflict resolution
  - Test error handling
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.5, 5.6_

- [x] 13. Implement router and main worker entry point
  - Set up Hono router
  - Register all routes (auth, progress)
  - Apply CORS middleware globally
  - Apply error handling middleware
  - Export default fetch handler
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 14. Write integration tests
- [x] 14.1 Write OAuth flow integration test
  - Test complete flow from initiation to callback
  - Test state parameter validation
  - Test user creation on first login
  - Test user update on subsequent logins
  - Test JWT generation and return
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 7.2_

- [x] 14.2 Write progress sync integration test
  - Test syncing new progress data
  - Test merging with existing data
  - Test conflict resolution
  - Test batch operations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 15. Create frontend auth store
  - Create Pinia store with AuthState interface
  - Implement state properties (user, token, isAuthenticated, isLoading)
  - Implement actions (setUser, setToken, clearAuth)
  - Add persistence to localStorage
  - _Requirements: 8.4_

- [x] 16. Create frontend auth composable
  - Create useAuth composable
  - Implement signInWithGoogle function (redirect to worker)
  - Implement logout function (clear token, call API)
  - Implement syncProgress function
  - Handle OAuth callback and token extraction
  - _Requirements: 8.1, 8.3, 8.5, 8.6, 8.7_

- [x] 17. Create frontend API client
  - Create ApiClient class with baseUrl
  - Implement getAuthHeader method
  - Implement get and post methods
  - Add Authorization header for authenticated requests
  - Handle 401 errors with automatic logout
  - _Requirements: 3.1, 8.6_

- [x] 18. Update frontend header component
  - Add "Sign in with Google" button when not authenticated
  - Display user name and profile picture when authenticated
  - Add logout button when authenticated
  - Style with existing Tailwind classes
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 19. Integrate progress sync with existing stores
  - Update progress store to call syncProgress on changes
  - Sync when module is completed
  - Sync when quiz is completed
  - Sync when bookmark is added/removed
  - Only sync if user is authenticated
  - _Requirements: 8.7, 4.1, 4.2, 4.3_

- [x] 20. Add OAuth callback page
  - Create callback page to handle OAuth redirect
  - Extract token from URL parameters
  - Store token in auth store
  - Redirect to home page or original destination
  - Display error message if OAuth failed
  - _Requirements: 2.5, 2.6, 8.3, 8.4_

- [x] 21. Update environment configuration
  - Add NUXT_PUBLIC_API_URL to .env.example
  - Document required Cloudflare Worker secrets
  - Update README with setup instructions
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.1, 7.7_

- [x] 22. Create deployment documentation
  - Document Cloudflare Worker deployment steps
  - Document D1 database setup and migration
  - Document Google OAuth app configuration
  - Document environment variable setup
  - Document frontend deployment updates
  - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 7.7_
