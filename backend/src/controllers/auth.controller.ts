import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AuthService } from '../services/auth.service';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role, warehouseId } = req.body;

      const result = await AuthService.register(name, email, password, role, warehouseId);

      res.status(201).json(
        ApiResponse.ok('User registered successfully', result).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      const cookieOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // For development allow Lax so the cookie is sent on top-level navigations.
        // In production we use 'none' (requires secure=true) for cross-site contexts.
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      };

      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      res.json(
        ApiResponse.ok('Login successful', {
          id: result.id,
          email: result.email,
          name: result.name,
          role: result.role,
          accessToken: result.accessToken,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new ApiError(401, 'Refresh token not found');
      }

      // Verify and decode the refresh token to extract user info
      const env = getEnv();
      let decoded: any;
      try {
        decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET as string) as any;
      } catch (err) {
        throw new ApiError(401, 'Invalid or expired refresh token');
      }

      const userId = decoded?.id;
      if (!userId) {
        throw new ApiError(401, 'Invalid refresh token payload');
      }

      const accessToken = await AuthService.refreshAccessToken(userId, refreshToken);

      res.json(
        ApiResponse.ok('Token refreshed successfully', { accessToken }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      await AuthService.logout(authReq.user.id);

      res.clearCookie('refreshToken');

      res.json(ApiResponse.ok('Logout successful').toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { currentPassword, newPassword } = req.body;

      await AuthService.changePassword(
        authReq.user.id,
        currentPassword,
        newPassword,
      );

      res.json(
        ApiResponse.ok('Password changed successfully').toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;

      // Check if user is admin
      if (!authReq.user || authReq.user.role !== 'admin') {
        throw new ApiError(403, 'Only admins can create users');
      }

      const { name, email, password, role, warehouseId } = req.body;

      // Validate input
      if (!name || !email || !password || !role) {
        throw new ApiError(400, 'Missing required fields: name, email, password, role');
      }

      if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
      }

      if (!['admin', 'pharmacist', 'warehouse_staff', 'inspector'].includes(role)) {
        throw new ApiError(400, 'Invalid role');
      }

      const { DatabaseService } = await import('../lib/database');
      const result = await DatabaseService.createUser(
        name,
        email,
        password,
        role,
        warehouseId,
      );

      if (!result.success) {
        throw new ApiError(409, result.message || 'Failed to create user');
      }

      res.status(201).json(
        ApiResponse.ok('User created successfully', result.user).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async createSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;

      // Check if user is admin
      if (!authReq.user || authReq.user.role !== 'admin') {
        throw new ApiError(403, 'Only admins can create super admins');
      }

      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        throw new ApiError(400, 'Missing required fields: name, email, password');
      }

      if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
      }

      const { DatabaseService } = await import('../lib/database');
      const result = await DatabaseService.createSuperAdmin(name, email, password);

      if (!result.success) {
        throw new ApiError(409, result.message || 'Failed to create super admin');
      }

      res.status(201).json(
        ApiResponse.ok('Super admin created successfully', result.user).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }
}
