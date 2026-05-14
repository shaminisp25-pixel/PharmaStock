import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { getEnv } from '../config/env';
import { ApiError } from '../utils/ApiError';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const env = getEnv();

const redis = new Redis(env.REDIS_URL);

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  warehouseId?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.BCRYPT_ROUNDS);
  }

  static async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET as string, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as string,
    } as any);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET as string, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as string,
    } as any);
  }

  static async storeRefreshToken(userId: string, token: string): Promise<void> {
    const refreshDuration = 7 * 24 * 60 * 60; // 7 days in seconds
    await redis.setex(`refresh:${userId}`, refreshDuration, token);
  }

  static async getRefreshToken(userId: string): Promise<string | null> {
    return redis.get(`refresh:${userId}`);
  }

  static async deleteRefreshToken(userId: string): Promise<void> {
    await redis.del(`refresh:${userId}`);
  }

  static async deleteAllRefreshTokens(userId: string): Promise<void> {
    await redis.del(`refresh:${userId}`);
  }

  static async register(
    name: string,
    email: string,
    password: string,
    role: string,
    warehouseId?: string,
  ): Promise<{
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    const passwordHash = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as any,
        warehouseId,
      },
    });

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      warehouseId: user.warehouseId ?? undefined,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  static async login(email: string, password: string): Promise<{
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const passwordMatch = await this.comparePasswords(password, user.passwordHash);

    if (!passwordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      warehouseId: user.warehouseId ?? undefined,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  static async refreshAccessToken(userId: string, refreshToken: string): Promise<string> {
    const storedToken = await this.getRefreshToken(userId);

    if (!storedToken || storedToken !== refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      await this.deleteRefreshToken(userId);
      throw new ApiError(401, 'User not found or inactive');
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      warehouseId: user.warehouseId ?? undefined,
    };

    return this.generateAccessToken(payload);
  }

  static async logout(userId: string): Promise<void> {
    await this.deleteRefreshToken(userId);
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const passwordMatch = await this.comparePasswords(currentPassword, user.passwordHash);

    if (!passwordMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const newPasswordHash = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all refresh tokens
    await this.deleteAllRefreshTokens(userId);
  }
}
