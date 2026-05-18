import rateLimit from 'express-rate-limit';
import { getEnv } from '../config/env';

const env = getEnv();

// Create limiters at app initialization time
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  skip: (req) => process.env.NODE_ENV === 'test',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.AUTH_RATE_LIMIT_MAX,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
  skip: (req) => process.env.NODE_ENV === 'test',
});

export const importLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    message: 'Too many import requests, please try again later',
  },
  skip: (req) => process.env.NODE_ENV === 'test',
});
