import rateLimit from 'express-rate-limit';
import { getEnv } from '../config/env';

// Create limiters lazily when first accessed
let globalLimiterInstance: any;
let authLimiterInstance: any;
let importLimiterInstance: any;

function getGlobalLimiter() {
  if (!globalLimiterInstance) {
    const env = getEnv();
    globalLimiterInstance = rateLimit({
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
  }
  return globalLimiterInstance;
}

function getAuthLimiter() {
  if (!authLimiterInstance) {
    const env = getEnv();
    authLimiterInstance = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: env.AUTH_RATE_LIMIT_MAX,
      skipSuccessfulRequests: true,
      message: {
        success: false,
        message: 'Too many login attempts, please try again later',
      },
      skip: (req) => process.env.NODE_ENV === 'test',
    });
  }
  return authLimiterInstance;
}

function getImportLimiter() {
  if (!importLimiterInstance) {
    importLimiterInstance = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20,
      message: {
        success: false,
        message: 'Too many import requests, please try again later',
      },
      skip: (req) => process.env.NODE_ENV === 'test',
    });
  }
  return importLimiterInstance;
}

// Export as middleware functions
export const globalLimiter = (req: any, res: any, next: any) => getGlobalLimiter()(req, res, next);
export const authLimiter = (req: any, res: any, next: any) => getAuthLimiter()(req, res, next);
export const importLimiter = (req: any, res: any, next: any) => getImportLimiter()(req, res, next);
