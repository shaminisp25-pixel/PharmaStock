import { Router, Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../lib/database';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { AuthRequest, authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /system/db-status:
 *   get:
 *     summary: Check database connection status
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Database status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                     timestamp:
 *                       type: string
 *                     stats:
 *                       type: object
 */
router.get('/db-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await DatabaseService.testConnection();
    res.json(ApiResponse.ok('Database status retrieved', status).toJSON());
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /system/db-stats:
 *   get:
 *     summary: Get detailed database statistics (Admin only)
 *     tags:
 *       - System
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Database statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  '/db-stats',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user || authReq.user.role !== 'admin') {
        throw new ApiError(403, 'Only admins can view database statistics');
      }

      const stats = await DatabaseService.getDatabaseStats();
      res.json(ApiResponse.ok('Database statistics retrieved', stats).toJSON());
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /system/db-report:
 *   get:
 *     summary: Get comprehensive database report (Admin only)
 *     tags:
 *       - System
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Complete database report
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  '/db-report',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest;

      if (!authReq.user || authReq.user.role !== 'admin') {
        throw new ApiError(403, 'Only admins can view database reports');
      }

      const stats = await DatabaseService.getDatabaseStats();
      const users = await DatabaseService.getAllUsers();

      const report = {
        timestamp: new Date().toISOString(),
        summary: stats.overall,
        batchStats: stats.batchStatsByStatus,
        alertStats: stats.alertStatsByType,
        users: users.users,
        userCount: users.count,
      };

      res.json(ApiResponse.ok('Database report generated', report).toJSON());
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /system/health:
 *   get:
 *     summary: Get system health status
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: System is healthy
 */
router.get('/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbStatus = await DatabaseService.testConnection();

    const health = {
      status: dbStatus.connected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbStatus.connected,
        message: dbStatus.message,
      },
      uptime: process.uptime(),
    };

    const statusCode = dbStatus.connected ? 200 : 503;
    res.status(statusCode).json(ApiResponse.ok('System health check', health).toJSON());
  } catch (error) {
    next(error);
  }
});

export default router;
