import { Request, Response, NextFunction } from 'express';
import { getEnv } from '../config/env';
import { ApiError } from '../utils/ApiError';

export const apiKeyGuard = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const env = getEnv();

  if (!apiKey || apiKey !== env.ERP_WEBHOOK_SECRET) {
    throw new ApiError(401, 'Invalid or missing API key');
  }

  next();
};
