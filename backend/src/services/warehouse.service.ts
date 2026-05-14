import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export class WarehouseService {
  static async getAllWarehouses(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({
        skip,
        take: limit,
        include: {
          users: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      prisma.warehouse.count(),
    ]);

    return {
      data: warehouses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getWarehouseById(id: string) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true },
        },
        batches: {
          select: { id: true, batchNo: true, quantity: true, status: true },
        },
      },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    return warehouse;
  }

  static async createWarehouse(
    name: string,
    location: string,
    tempMin: number,
    tempMax: number,
  ) {
    if (tempMin >= tempMax) {
      throw new ApiError(400, 'Min temperature must be less than max temperature');
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
        tempMin,
        tempMax,
      },
    });

    return warehouse;
  }

  static async updateWarehouse(id: string, data: any) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    if (data.tempMin && data.tempMax && data.tempMin >= data.tempMax) {
      throw new ApiError(400, 'Min temperature must be less than max temperature');
    }

    const updated = await prisma.warehouse.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.location && { location: data.location }),
        ...(data.tempMin !== undefined && { tempMin: data.tempMin }),
        ...(data.tempMax !== undefined && { tempMax: data.tempMax }),
      },
    });

    return updated;
  }

  static async deleteWarehouse(id: string) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    // Check if warehouse has batches
    const batchCount = await prisma.batch.count({
      where: { warehouseId: id },
    });

    if (batchCount > 0) {
      throw new ApiError(
        400,
        'Cannot delete warehouse with existing batches',
      );
    }

    await prisma.warehouse.delete({
      where: { id },
    });

    return { message: 'Warehouse deleted successfully' };
  }
}
