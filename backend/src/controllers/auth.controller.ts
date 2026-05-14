import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AuthService } from '../services/auth.service';
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

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

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

      const authReq = req as AuthRequest;
      if (!authReq.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const accessToken = await AuthService.refreshAccessToken(
        authReq.user.id,
        refreshToken,
      );

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
}
