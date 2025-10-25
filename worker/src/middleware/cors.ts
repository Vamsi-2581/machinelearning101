/**
 * CORS middleware for handling cross-origin requests
 * Requirements: 5.8
 */

import { Context, Next } from "hono";
import type { Env } from "../types";

/**
 * CORS configuration headers
 */
export const getCorsHeaders = (origin: string, allowedOrigin: string) => {
  // Validate origin against FRONTEND_URL
  const isAllowedOrigin = origin === allowedOrigin;
  
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
};

/**
 * CORS middleware that adds CORS headers to all responses
 * and handles preflight requests
 */
export const corsMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
  const origin = c.req.header("Origin") || "";
  const allowedOrigin = c.env.FRONTEND_URL;

  // Handle preflight requests
  if (c.req.method === "OPTIONS") {
    const headers = getCorsHeaders(origin, allowedOrigin);
    return new Response(null, {
      status: 204,
      headers,
    });
  }

  // Continue to next middleware/handler
  await next();

  // Add CORS headers to response
  const headers = getCorsHeaders(origin, allowedOrigin);
  Object.entries(headers).forEach(([key, value]) => {
    c.res.headers.set(key, value);
  });
};
