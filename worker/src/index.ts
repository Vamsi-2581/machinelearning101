/**
 * Main Cloudflare Worker entry point
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8
 */

import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import {
  handleGoogleOAuthInitiation,
  handleOAuthCallback,
  handleGetUserProfile,
  handleLogout,
} from "./handlers/auth";
import { handleSyncProgress, handleGetProgress } from "./handlers/progress";
import { ApiErrorClass, createErrorResponse, logError } from "./utils/errors";

// Environment bindings interface
export interface Env {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
}

// Initialize Hono app
const app = new Hono<{ Bindings: Env }>();

// Apply CORS middleware globally
// Requirements: 5.8
app.use("*", corsMiddleware);

// Global error handling middleware
// Requirements: 5.7
app.onError((err, c) => {
  // Log the error with sanitization
  logError(err, {
    path: c.req.path,
    method: c.req.method,
  });

  // Return formatted error response
  return createErrorResponse(err);
});

// Health check endpoint
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "ML Platform Auth Worker",
  });
});

// Authentication routes
// Requirements: 5.1, 5.2, 5.3, 5.4

/**
 * GET /api/auth/google
 * Initiates Google OAuth flow
 * Requirements: 5.1
 */
app.get("/api/auth/google", async (c) => {
  return handleGoogleOAuthInitiation(c.req.raw, c.env);
});

/**
 * GET /api/auth/google/callback
 * Handles OAuth callback from Google
 * Requirements: 5.2
 */
app.get("/api/auth/google/callback", async (c) => {
  return handleOAuthCallback(c.req.raw, c.env);
});

/**
 * GET /api/auth/me
 * Returns authenticated user's profile
 * Requirements: 5.3
 */
app.get("/api/auth/me", async (c) => {
  return handleGetUserProfile(c.req.raw, c.env);
});

/**
 * POST /api/auth/logout
 * Logs out the user (client-side token removal)
 * Requirements: 5.4
 */
app.post("/api/auth/logout", async (c) => {
  return handleLogout(c.req.raw, c.env);
});

// Progress sync routes
// Requirements: 5.5, 5.6

/**
 * POST /api/progress/sync
 * Syncs user progress data to the cloud
 * Requirements: 5.5
 */
app.post("/api/progress/sync", async (c) => {
  return handleSyncProgress(c.req.raw, c.env);
});

/**
 * GET /api/progress
 * Retrieves user's progress data
 * Requirements: 5.6
 */
app.get("/api/progress", async (c) => {
  return handleGetProgress(c.req.raw, c.env);
});

// Export the fetch handler
export default app;
