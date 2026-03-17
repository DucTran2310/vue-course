import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest } from "@/types/index.js";
import { NextFunction, Request, Response } from "express";

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Maximum number of attempts within the window
  message: string;
}

/**
 * Create a rate limiter middleware
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxAttempts, message } = options;

  return function rateLimiter(
    req: Request & Partial<AuthRequest>,
    res: Response,
    next: NextFunction
  ): void {
    // Get identifier (IP address or user ID)
    const identifier = (req as AuthRequest).user?.id?.toString() || req.ip || "anonymous";
    const key = `${req.path}:${identifier}`;
    const now = Date.now();

    // Get or create record
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      // Create new record
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    // Check if limit exceeded
    if (record.count >= maxAttempts) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.set("Retry-After", retryAfter.toString());
      next(new HttpError(429, message));
      return;
    }

    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    next();
  };
}

// Cleanup old records periodically (every 5 minutes)
setInterval(
  () => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

/**
 * Predefined rate limiters for different endpoints
 */
export const rateLimiters = {
  // Change password: 5 attempts per 15 minutes
  changePassword: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    message: "Too many password change attempts. Please try again later.",
  }),

  // Login: 10 attempts per 15 minutes
  login: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 10,
    message: "Too many login attempts. Please try again later.",
  }),

  // Register: 5 attempts per hour
  register: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 5,
    message: "Too many registration attempts. Please try again later.",
  }),

  // Email verification: 10 attempts per hour
  verifyEmail: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10,
    message: "Too many verification attempts. Please try again later.",
  }),
};
