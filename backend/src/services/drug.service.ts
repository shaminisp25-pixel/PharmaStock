import { ApiError } from '../utils/ApiError';
import { getPrismaClient } from '../lib/database';

export class DrugService {
  static async getAllDrugs(
    page: number,
    limit: number,
    search?: string,
    category?: string,
    manufacturer?: string,
  ) {
    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { composition: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (manufacturer) where.manufacturer = { contains: manufacturer, mode: 'insensitive' };

    const [drugs, total] = await Promise.all([
      prisma.drug.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.drug.count({ where }),
    ]);

    return {
      data: drugs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getDrugById(id: string) {
    const prisma = getPrismaClient();
    const drug = await prisma.drug.findUnique({
      where: { id },
      include: {
        batches: {
          select: {
            id: true,
            batchNo: true,
            quantity: true,
            status: true,
            expiryDate: true,
            warehouse: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!drug) {
      throw new ApiError(404, 'Drug not found');
    }

    return drug;
  }

  static async createDrug(
    name: string,
    manufacturer: string,
    tempMin: number,
    tempMax: number,
    composition?: string,
    category?: string,
    storageNotes?: string,
  ) {
    const prisma = getPrismaClient();
    if (tempMin >= tempMax) {
      throw new ApiError(400, 'Min temperature must be less than max temperature');
    }

    const drug = await prisma.drug.create({
      data: {
        name,
        manufacturer,
        tempMin,
        tempMax,
        composition,
        category,
        storageNotes,
      },
    });

    return drug;
  }

  static async updateDrug(id: string, data: any) {
    const prisma = getPrismaClient();
    const drug = await prisma.drug.findUnique({
      where: { id },
    });

    if (!drug) {
      throw new ApiError(404, 'Drug not found');
    }

    if (data.tempMin && data.tempMax && data.tempMin >= data.tempMax) {
      throw new ApiError(400, 'Min temperature must be less than max temperature');
    }

    const updated = await prisma.drug.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.manufacturer && { manufacturer: data.manufacturer }),
        ...(data.composition !== undefined && { composition: data.composition }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.tempMin !== undefined && { tempMin: data.tempMin }),
        ...(data.tempMax !== undefined && { tempMax: data.tempMax }),
        ...(data.storageNotes !== undefined && { storageNotes: data.storageNotes }),
      },
    });

    return updated;
  }

  static async deleteDrug(id: string) {
    const prisma = getPrismaClient();
    const drug = await prisma.drug.findUnique({
      where: { id },
    });

    if (!drug) {
      throw new ApiError(404, 'Drug not found');
    }

    const batchCount = await prisma.batch.count({
      where: { drugId: id },
    });

    if (batchCount > 0) {
      throw new ApiError(400, 'Cannot delete drug with existing batches');
    }

    await prisma.drug.delete({
      where: { id },
    });

    return { message: 'Drug deleted successfully' };
  }
}
