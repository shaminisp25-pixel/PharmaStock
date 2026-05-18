import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import logger from '../utils/logger';
import { getPrismaClient } from '../lib/database';

export const auditLog = (entityType: string) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      if (res.statusCode < 400 && req.user) {
        const prisma = getPrismaClient();
        prisma.auditLog
          .create({
            data: {
              userId: req.user!.id,
              action: req.method,
              entityType,
              entityId: req.params.id ?? body?.data?.id ?? 'bulk',
              beforeState: res.locals.beforeState ?? null,
              afterState: body?.data ?? null,
              ipAddress: req.ip ?? 'unknown',
              userAgent: req.headers['user-agent'] ?? 'unknown',
            },
          })
          .catch((err) => logger.error('Audit log creation failed', err));
      }
      return originalJson(body);
    };

    next();
  };
