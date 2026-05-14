import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    warehouseId?: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No authorization token provided');
    }

    const token = authHeader.substring(7);
    const env = getEnv();

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      warehouseId: decoded.warehouseId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid or expired token');
    }
    next(error);
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const env = getEnv();

      try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          warehouseId: decoded.warehouseId,
        };
      } catch (error) {
        // Token invalid but optional, continue
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
