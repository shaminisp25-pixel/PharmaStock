import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { AuthService } from './auth.service';

const prisma = new PrismaClient();

export class UserService {
  static async getAllUsers(page: number, limit: number, role?: string, warehouseId?: string) {
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (role) where.role = role;
    if (warehouseId) where.warehouseId = warehouseId;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          warehouseId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        warehouseId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  static async createUser(
    name: string,
    email: string,
    password: string,
    role: string,
    warehouseId?: string,
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, 'Email already exists');
    }

    const passwordHash = await AuthService.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as any,
        warehouseId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        warehouseId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async updateUser(id: string, data: any) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.role && { role: data.role }),
        ...(data.warehouseId !== undefined && { warehouseId: data.warehouseId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        warehouseId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  static async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User deleted successfully' };
  }
}
