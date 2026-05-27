import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { DispatchService } from '../services/dispatch.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class DispatchController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const batchId = req.query.batchId as string | undefined;
      const warehouseId = req.query.warehouseId as string | undefined;
      const destination = req.query.destination as string | undefined;

      const result = await DispatchService.getAllDispatchRecords(
        page,
        limit,
        batchId,
        warehouseId,
        destination,
      );

      res.json(
        ApiResponse.ok('Dispatch records fetched successfully', result.data, {
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
      const record = await DispatchService.getDispatchRecordById(req.params.id);
      res.json(ApiResponse.ok('Dispatch record fetched successfully', record).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { batchId, quantityDispatched, destination, prescriptionRef } = req.body;

      if (!authReq.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const record = await DispatchService.createDispatchRecord(
        batchId,
        quantityDispatched,
        destination,
        authReq.user.id,
        prescriptionRef,
      );

      res.status(201).json(ApiResponse.ok('Dispatch record created successfully', record).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DispatchService.deleteDispatchRecord(req.params.id);
      res.json(ApiResponse.ok(result.message).toJSON());
    } catch (error) {
      next(error);
    }
  }
}
