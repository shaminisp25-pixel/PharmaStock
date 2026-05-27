import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['admin', 'pharmacist', 'warehouse_staff', 'inspector']),
    warehouseId: z.string().uuid().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

// User Schemas
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['admin', 'pharmacist', 'warehouse_staff', 'inspector']),
    warehouseId: z.string().uuid().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.enum(['admin', 'pharmacist', 'warehouse_staff', 'inspector']).optional(),
    warehouseId: z.string().uuid().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

// Warehouse Schemas
export const createWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    location: z.string().min(1, 'Location is required'),
    tempMin: z.number().min(-50, 'Min temp cannot be below -50°C'),
    tempMax: z.number().max(50, 'Max temp cannot be above 50°C'),
  }),
});

export const updateWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    tempMin: z.number().min(-50).optional(),
    tempMax: z.number().max(50).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

// Drug Schemas
export const createDrugSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Drug name is required'),
    composition: z.string().optional(),
    manufacturer: z.string().min(1, 'Manufacturer is required'),
    category: z.string().optional(),
    tempMin: z.number(),
    tempMax: z.number(),
    storageNotes: z.string().optional(),
  }),
});

export const updateDrugSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    composition: z.string().optional(),
    manufacturer: z.string().min(1).optional(),
    category: z.string().optional(),
    tempMin: z.number().optional(),
    tempMax: z.number().optional(),
    storageNotes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

// Batch Schemas
export const createBatchSchema = z.object({
  body: z.object({
    drugId: z.string().uuid('Invalid drug ID'),
    batchNo: z.string().min(1, 'Batch number is required'),
    expiryDate: z.string().datetime('Invalid expiry date format').transform(d => new Date(d)),
    quantity: z.number().int().positive('Quantity must be positive'),
    warehouseId: z.string().uuid('Invalid warehouse ID'),
  }),
});

export const updateBatchStatusSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'dispatched', 'expired', 'quarantined']),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const dispatchBatchSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('Quantity must be positive'),
    destination: z.string().min(1, 'Destination is required'),
    prescriptionRef: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const scanBatchSchema = z.object({
  body: z.object({
    barcode: z.string().min(1, 'Barcode is required'),
  }),
});

// Import Schemas
export const uploadImportSchema = z.object({
  body: z.any(), // File will be handled by multer
});

// Pagination Schemas
export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, 'Page must be >= 1').optional().default(1),
    limit: z.coerce.number().int().min(1, 'Limit must be >= 1').max(10000, 'Limit must be <= 10000').optional().default(20),
  }).optional(),
}).passthrough();

// Alert Schemas
export const resolveAlertSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

// Report Query Schemas
export const expiryReportSchema = z.object({
  query: z.object({
    warehouseId: z.string().uuid().optional(),
    drugId: z.string().uuid().optional(),
    expiryBefore: z.string().datetime().optional(),
    expiryAfter: z.string().datetime().optional(),
    format: z.enum(['csv', 'pdf']).default('csv'),
  }),
});
