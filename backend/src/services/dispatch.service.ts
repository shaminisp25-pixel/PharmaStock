import { ApiError } from '../utils/ApiError';
import { getPrismaClient } from '../lib/database';

export class DispatchService {
  static async getAllDispatchRecords(
    page: number,
    limit: number,
    batchId?: string,
    warehouseId?: string,
    destination?: string,
  ) {
    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    const where: any = {};
    if (batchId) where.batchId = batchId;
    if (destination) where.destination = { contains: destination, mode: 'insensitive' };

    // If warehouseId is provided, filter by warehouse
    if (warehouseId) {
      where.batch = {
        warehouseId,
      };
    }

    const [records, total] = await Promise.all([
      prisma.dispatchRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          batch: {
            include: {
              drug: { select: { id: true, name: true, manufacturer: true, composition: true } },
              warehouse: { select: { id: true, name: true } },
            },
          },
          dispatchedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { dispatchedAt: 'desc' },
      }),
      prisma.dispatchRecord.count({ where }),
    ]);

    return {
      data: records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getDispatchRecordById(id: string) {
    const prisma = getPrismaClient();
    const record = await prisma.dispatchRecord.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            drug: true,
            warehouse: true,
          },
        },
        dispatchedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!record) {
      throw new ApiError(404, 'Dispatch record not found');
    }

    return record;
  }

  static async createDispatchRecord(
    batchId: string,
    quantityDispatched: number,
    destination: string,
    dispatchedById: string,
    prescriptionRef?: string,
  ) {
    const prisma = getPrismaClient();

    // Verify batch exists
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { drug: true },
    });

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: dispatchedById },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check if batch has expired
    if (batch.expiryDate <= new Date()) {
      throw new ApiError(400, 'Cannot dispatch expired batch');
    }

    // Check available quantity
    const totalDispatched = await prisma.dispatchRecord.aggregate({
      where: { batchId },
      _sum: { quantityDispatched: true },
    });

    const availableQuantity = batch.quantity - (totalDispatched._sum.quantityDispatched || 0);

    if (availableQuantity < quantityDispatched) {
      throw new ApiError(400, `Insufficient quantity. Available: ${availableQuantity}`);
    }

    // Create dispatch record
    const record = await prisma.dispatchRecord.create({
      data: {
        batchId,
        quantityDispatched,
        destination,
        dispatchedById,
        prescriptionRef,
      },
      include: {
        batch: {
          include: {
            drug: { select: { id: true, name: true, manufacturer: true } },
            warehouse: { select: { id: true, name: true } },
          },
        },
        dispatchedBy: { select: { id: true, name: true, email: true } },
      },
    });

    // Update batch status to dispatched if all quantity is dispatched
    const updatedTotalDispatched = await prisma.dispatchRecord.aggregate({
      where: { batchId },
      _sum: { quantityDispatched: true },
    });

    if (updatedTotalDispatched._sum.quantityDispatched === batch.quantity) {
      await prisma.batch.update({
        where: { id: batchId },
        data: { status: 'dispatched' },
      });
    }

    return record;
  }

  static async deleteDispatchRecord(id: string) {
    const prisma = getPrismaClient();

    const record = await prisma.dispatchRecord.findUnique({
      where: { id },
      include: { batch: true },
    });

    if (!record) {
      throw new ApiError(404, 'Dispatch record not found');
    }

    await prisma.dispatchRecord.delete({
      where: { id },
    });

    // Reset batch status if needed
    const remainingDispatches = await prisma.dispatchRecord.count({
      where: { batchId: record.batchId },
    });

    if (remainingDispatches === 0 && record.batch.status === 'dispatched') {
      await prisma.batch.update({
        where: { id: record.batchId },
        data: { status: 'active' },
      });
    }

    return { message: 'Dispatch record deleted successfully' };
  }
}
