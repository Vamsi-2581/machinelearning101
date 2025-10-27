/**
 * CORS middleware for handling cross-origin requests
 * Requirements: 5.8
 */

import { Context, Next } from "hono";
import type { Env } from "../types";

/**
 * CORS configuration headers - Very permissive for development
 */
export const getCorsHeaders = (origin: string) => {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
};

/**
 * CORS middleware that adds CORS headers to all responses
 * and handles preflight requests
 */
export const corsMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
  const origin = c.req.header("Origin") || "*";

  // Handle preflight requests
  if (c.req.method === "OPTIONS") {
    const headers = getCorsHeaders(origin);
    return new Response(null, {
      status: 204,
      headers,
    });
  }

  // Continue to next middleware/handler
  await next();

  // Add CORS headers to response
  const headers = getCorsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    c.res.headers.set(key, value);
  });
};
