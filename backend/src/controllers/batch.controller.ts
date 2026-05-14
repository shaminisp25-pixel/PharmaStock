import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BatchService } from '../services/batch.service';
import { AlertService, AuditService, ImportService } from '../services/alert.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class BatchController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;
      const warehouseId = req.query.warehouseId as string | undefined;
      const drugId = req.query.drugId as string | undefined;
      const expiryBefore = req.query.expiryBefore ? new Date(req.query.expiryBefore as string) : undefined;
      const expiryAfter = req.query.expiryAfter ? new Date(req.query.expiryAfter as string) : undefined;

      const result = await BatchService.getAllBatches(
        page,
        limit,
        status,
        warehouseId,
        drugId,
        expiryBefore,
        expiryAfter,
      );

      res.json(
        ApiResponse.ok('Batches fetched successfully', result.data, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const batch = await BatchService.getBatchById(req.params.id);
      res.json(ApiResponse.ok('Batch fetched successfully', batch).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { drugId, batchNo, expiryDate, quantity, warehouseId } = req.body;

      const batch = await BatchService.createBatch(
        drugId,
        batchNo,
        new Date(expiryDate),
        quantity,
        warehouseId,
        authReq.user?.id,
      );

      res.status(201).json(ApiResponse.ok('Batch created successfully', batch).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const batch = await BatchService.updateBatchStatus(req.params.id, status);
      res.json(ApiResponse.ok('Batch status updated successfully', batch).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async dispatch(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { quantity, destination, prescriptionRef } = req.body;

      if (!authReq.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const dispatch = await BatchService.dispatchBatch(
        req.params.id,
        quantity,
        destination,
        authReq.user.id,
        prescriptionRef,
      );

      res.json(ApiResponse.ok('Batch dispatched successfully', dispatch).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async scan(req: Request, res: Response, next: NextFunction) {
    try {
      const { barcode } = req.body;
      const batch = await BatchService.scanBatch(barcode);
      res.json(ApiResponse.ok('Batch found', batch).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BatchService.deleteBatch(req.params.id);
      res.json(ApiResponse.ok(result.message).toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export class AlertController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const alertType = req.query.alertType as string | undefined;
      const resolved = req.query.resolved ? req.query.resolved === 'true' : undefined;
      const warehouseId = req.query.warehouseId as string | undefined;

      const result = await AlertService.getAllAlerts(page, limit, alertType, resolved, warehouseId);

      res.json(
        ApiResponse.ok('Alerts fetched successfully', result.data, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await AlertService.getAlertById(req.params.id);
      res.json(ApiResponse.ok('Alert fetched successfully', alert).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await AlertService.resolveAlert(req.params.id);
      res.json(ApiResponse.ok('Alert resolved successfully', alert).toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export class AuditController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const userId = req.query.userId as string | undefined;
      const entityType = req.query.entityType as string | undefined;
      const entityId = req.query.entityId as string | undefined;
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

      const result = await AuditService.getAllAuditLogs(
        page,
        limit,
        userId,
        entityType,
        entityId,
        dateFrom,
        dateTo,
      );

      res.json(
        ApiResponse.ok('Audit logs fetched successfully', result.data, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }
}

export class ImportController {
  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const uploadedById = req.query.uploadedById as string | undefined;

      const result = await ImportService.getAllImportLogs(page, limit, uploadedById);

      res.json(
        ApiResponse.ok('Import logs fetched successfully', result.data, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async getLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await ImportService.getImportLogById(req.params.id);
      res.json(ApiResponse.ok('Import log fetched successfully', log).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async uploadDrugs(req: Request, res: Response, next: NextFunction) {
    try {
      // Placeholder for file upload logic
      res.json(
        ApiResponse.ok('Import processing started', {
          message: 'File received and processing...',
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }
}
