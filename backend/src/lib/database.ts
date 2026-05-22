import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    const client = getPrismaClient();
    await client.$connect();
    logger.info('✓ Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    logger.info('Database disconnected');
  }
}

/**
 * Database Service - Utilities for user and data management
 */
export class DatabaseService {
  /**
   * Test database connection
   */
  static async testConnection(): Promise<{
    connected: boolean;
    message: string;
    timestamp: string;
    stats?: Record<string, number>;
  }> {
    try {
      const client = getPrismaClient();
      await client.$queryRaw`SELECT 1`;

      // Get basic stats
      const userCount = await client.user.count();
      const warehouseCount = await client.warehouse.count();
      const drugCount = await client.drug.count();
      const batchCount = await client.batch.count();

      return {
        connected: true,
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
        stats: {
          users: userCount,
          warehouses: warehouseCount,
          drugs: drugCount,
          batches: batchCount,
        },
      };
    } catch (error) {
      logger.error('Database connection test failed:', error);
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create a super admin user
   */
  static async createSuperAdmin(
    name: string,
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
    error?: string;
  }> {
    try {
      const client = getPrismaClient();

      // Check if user already exists
      const existing = await client.user.findUnique({ where: { email } });
      if (existing) {
        return {
          success: false,
          message: 'User with this email already exists',
          error: 'DUPLICATE_EMAIL',
        };
      }

      if (password.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters',
          error: 'INVALID_PASSWORD',
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const superAdmin = await client.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: 'admin',
          isActive: true,
        },
      });

      // Log the creation
      await client.auditLog.create({
        data: {
          userId: superAdmin.id,
          action: 'create_super_admin',
          entityType: 'user',
          entityId: superAdmin.id,
          changes: {
            created_by: 'system',
            role: 'admin',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info(`Super admin created: ${superAdmin.email}`);

      return {
        success: true,
        message: 'Super admin created successfully',
        user: {
          id: superAdmin.id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role,
          createdAt: superAdmin.createdAt,
        },
      };
    } catch (error) {
      logger.error('Failed to create super admin:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create super admin',
        error: 'CREATION_FAILED',
      };
    }
  }

  /**
   * Create a regular user with any role
   */
  static async createUser(
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'pharmacist' | 'warehouse_staff' | 'inspector',
    warehouseId?: string,
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
    error?: string;
  }> {
    try {
      const client = getPrismaClient();

      // Check if user already exists
      const existing = await client.user.findUnique({ where: { email } });
      if (existing) {
        return {
          success: false,
          message: 'User with this email already exists',
          error: 'DUPLICATE_EMAIL',
        };
      }

      if (password.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters',
          error: 'INVALID_PASSWORD',
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await client.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role,
          warehouseId,
          isActive: true,
        },
        include: {
          warehouse: true,
        },
      });

      // Log the creation
      await client.auditLog.create({
        data: {
          userId: user.id,
          action: 'create',
          entityType: 'user',
          entityId: user.id,
          changes: {
            name: user.name,
            email: user.email,
            role: user.role,
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info(`User created: ${user.email} (${user.role})`);

      return {
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          warehouse: user.warehouse?.name,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      logger.error('Failed to create user:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user',
        error: 'CREATION_FAILED',
      };
    }
  }

  /**
   * Get all users with statistics
   */
  static async getAllUsers() {
    try {
      const client = getPrismaClient();
      const users = await client.user.findMany({
        include: {
          warehouse: true,
          _count: {
            select: {
              importLogs: true,
              dispatches: true,
              auditLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        count: users.length,
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          warehouse: u.warehouse?.name,
          isActive: u.isActive,
          createdAt: u.createdAt,
          statistics: u._count,
        })),
      };
    } catch (error) {
      logger.error('Failed to fetch users:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch users',
        users: [],
      };
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats() {
    try {
      const client = getPrismaClient();
      const stats = {
        users: await client.user.count(),
        warehouses: await client.warehouse.count(),
        drugs: await client.drug.count(),
        batches: await client.batch.count(),
        dispatchRecords: await client.dispatchRecord.count(),
        alerts: await client.alert.count(),
        importLogs: await client.importLog.count(),
        auditLogs: await client.auditLog.count(),
      };

      // Get batch status breakdown
      const batches = await client.batch.groupBy({
        by: ['status'],
        _count: true,
      });

      const batchStatsByStatus: Record<string, number> = {};
      batches.forEach((b) => {
        batchStatsByStatus[b.status] = b._count;
      });

      // Get alert status breakdown
      const alerts = await client.alert.groupBy({
        by: ['alertType'],
        _count: true,
      });

      const alertStatsByType: Record<string, number> = {};
      alerts.forEach((a) => {
        alertStatsByType[a.alertType] = a._count;
      });

      return {
        success: true,
        timestamp: new Date().toISOString(),
        overall: stats,
        batchStatsByStatus,
        alertStatsByType,
      };
    } catch (error) {
      logger.error('Failed to fetch database stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch database stats',
      };
    }
  }

  /**
   * Initialize default super admin if none exists
   */
  static async initializeDefaultSuperAdmin(): Promise<{
    success: boolean;
    message: string;
    user?: any;
  }> {
    try {
      const client = getPrismaClient();
      const adminCount = await client.user.count({
        where: { role: 'admin' },
      });

      if (adminCount === 0) {
        const result = await this.createSuperAdmin(
          'System Admin',
          'admin@pharmastock.com',
          'SecurePass123!',
        );

        return {
          success: result.success,
          message: result.success
            ? 'Default super admin created'
            : result.message,
          user: result.user,
        };
      }

      return {
        success: true,
        message: 'Admin user already exists',
      };
    } catch (error) {
      logger.error('Failed to initialize default super admin:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Initialization failed',
      };
    }
  }
}

