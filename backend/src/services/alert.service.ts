import { ApiError } from '../utils/ApiError';
import { getPrismaClient } from '../lib/database';

export class AlertService {
  static async getAllAlerts(
    page: number,
    limit: number,
    alertType?: string,
    resolved?: boolean,
    warehouseId?: string,
  ) {
    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    const where: any = {};
    if (alertType) where.alertType = alertType;
    if (resolved !== undefined) where.resolved = resolved;
    if (warehouseId) {
      where.batch = { warehouseId };
    }

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        skip,
        take: limit,
        include: {
          batch: {
            include: { drug: true, warehouse: true },
          },
        },
      }),
      prisma.alert.count({ where }),
    ]);

    return {
      data: alerts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getAlertById(id: string) {
    const prisma = getPrismaClient();
    const alert = await prisma.alert.findUnique({
      where: { id },
      include: {
        batch: {
          include: { drug: true, warehouse: true },
        },
      },
    });

    if (!alert) {
      throw new ApiError(404, 'Alert not found');
    }

    return alert;
  }

  static async resolveAlert(id: string) {
    const prisma = getPrismaClient();
    const alert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      throw new ApiError(404, 'Alert not found');
    }

    const updated = await prisma.alert.update({
      where: { id },
      data: {
        resolved: true,
        resolvedAt: new Date(),
      },
      include: {
        batch: { include: { drug: true, warehouse: true } },
      },
    });

    return updated;
  }

  static async createAlert(batchId: string, alertType: string) {
    const prisma = getPrismaClient();
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    const alert = await prisma.alert.create({
      data: {
        batchId,
        alertType: alertType as any,
      },
      include: { batch: { include: { drug: true, warehouse: true } } },
    });

    return alert;
  }
}

export class AuditService {
  static async getAllAuditLogs(
    page: number,
    limit: number,
    userId?: string,
    entityType?: string,
    entityId?: string,
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class ImportService {
  static async getAllImportLogs(
    page: number,
    limit: number,
    uploadedById?: string,
  ) {
    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    const where = uploadedById ? { uploadedById } : {};

    const [logs, total] = await Promise.all([
      prisma.importLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.importLog.count({ where }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getImportLogById(id: string) {
    const prisma = getPrismaClient();
    const log = await prisma.importLog.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!log) {
      throw new ApiError(404, 'Import log not found');
    }

    return log;
  }

  static async createImportLog(
    filename: string,
    totalRows: number,
    successRows: number,
    failedRows: number,
    errors: any[],
    uploadedById: string,
  ) {
    const prisma = getPrismaClient();
    const log = await prisma.importLog.create({
      data: {
        filename,
        totalRows,
        successRows,
        failedRows,
        errors,
        uploadedById,
      },
    });

    return log;
  }
}
