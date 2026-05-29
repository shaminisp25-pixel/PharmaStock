import { ApiError } from '../utils/ApiError';
import { getPrismaClient } from '../lib/database';

export class BatchService {
  static async getAllBatches(
    page: number,
    limit: number,
    status?: string,
    warehouseId?: string,
    drugId?: string,
    expiryBefore?: Date,
    expiryAfter?: Date,
  ) {
    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (warehouseId) where.warehouseId = warehouseId;
    if (drugId) where.drugId = drugId;
    if (expiryBefore || expiryAfter) {
      where.expiryDate = {};
      if (expiryBefore) where.expiryDate.lte = expiryBefore;
      if (expiryAfter) where.expiryDate.gte = expiryAfter;
    }

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          batchNo: true,
          expiryDate: true,
          quantity: true,
          status: true,
          drug: { select: { id: true, name: true, manufacturer: true } },
          warehouse: { select: { id: true, name: true } },
        },
      }),
      prisma.batch.count({ where }),
    ]);

    return {
      data: batches,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getBatchById(id: string) {
    const prisma = getPrismaClient();
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        drug: true,
        warehouse: true,
        dispatches: { include: { dispatchedBy: { select: { id: true, name: true, email: true } } } },
        alerts: true,
        importedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    return batch;
  }

  static async createBatch(
    drugId: string,
    batchNo: string,
    expiryDate: Date,
    quantity: number,
    warehouseId: string,
    importedById?: string,
  ) {
    const prisma = getPrismaClient();
    // Verify drug and warehouse exist
    const [drug, warehouse] = await Promise.all([
      prisma.drug.findUnique({ where: { id: drugId } }),
      prisma.warehouse.findUnique({ where: { id: warehouseId } }),
    ]);

    if (!drug) throw new ApiError(404, 'Drug not found');
    if (!warehouse) throw new ApiError(404, 'Warehouse not found');

    // Check batch number uniqueness
    const existing = await prisma.batch.findUnique({
      where: { batchNo },
    });

    if (existing) throw new ApiError(409, 'Batch number already exists');

    // Validate expiry date
    if (expiryDate <= new Date()) {
      throw new ApiError(400, 'Expiry date must be in the future');
    }

    const batch = await prisma.batch.create({
      data: {
        drugId,
        batchNo,
        expiryDate,
        quantity,
        warehouseId,
        importedById,
      },
      include: {
        drug: true,
        warehouse: true,
      },
    });

    return batch;
  }

  static async updateBatchStatus(id: string, status: string) {
    const prisma = getPrismaClient();
    const batch = await prisma.batch.findUnique({
      where: { id },
    });

    if (!batch) throw new ApiError(404, 'Batch not found');

    const updated = await prisma.batch.update({
      where: { id },
      data: { status: status as any },
      include: { drug: true, warehouse: true },
    });

    return updated;
  }

  static async dispatchBatch(
    batchId: string,
    quantity: number,
    destination: string,
    dispatchedById: string,
    prescriptionRef?: string,
  ) {
    const prisma = getPrismaClient();
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) throw new ApiError(404, 'Batch not found');
    if (batch.quantity < quantity) {
      throw new ApiError(400, 'Insufficient quantity available');
    }

    // Use transaction for atomicity
    const result = await prisma.$transaction([
      prisma.dispatchRecord.create({
        data: {
          batchId,
          quantityDispatched: quantity,
          destination,
          dispatchedById,
          prescriptionRef,
        },
      }),
      prisma.batch.update({
        where: { id: batchId },
        data: { quantity: batch.quantity - quantity },
      }),
    ]);

    return result[0];
  }

  static async scanBatch(barcode: string) {
    const prisma = getPrismaClient();
    // For now, treat barcode as batch number
    const batch = await prisma.batch.findUnique({
      where: { batchNo: barcode },
      include: {
        drug: true,
        warehouse: true,
      },
    });

    if (!batch) throw new ApiError(404, 'Batch not found with this barcode');

    return batch;
  }

  static async deleteBatch(id: string) {
    const prisma = getPrismaClient();
    const batch = await prisma.batch.findUnique({
      where: { id },
    });

    if (!batch) throw new ApiError(404, 'Batch not found');

    await prisma.batch.delete({
      where: { id },
    });

    return { message: 'Batch deleted successfully' };
  }
}
