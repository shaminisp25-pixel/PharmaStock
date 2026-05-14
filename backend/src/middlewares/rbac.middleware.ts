import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiError';

export const PERMISSIONS = {
  // Users
  'users:create': ['admin'],
  'users:read': ['admin'],
  'users:update': ['admin'],
  'users:delete': ['admin'],

  // Drugs
  'drugs:create': ['admin', 'pharmacist'],
  'drugs:read': ['admin', 'pharmacist', 'warehouse_staff', 'inspector'],
  'drugs:update': ['admin', 'pharmacist'],
  'drugs:delete': ['admin'],

  // Batches
  'batches:create': ['admin', 'warehouse_staff'],
  'batches:read': ['admin', 'pharmacist', 'warehouse_staff', 'inspector'],
  'batches:update': ['admin', 'pharmacist', 'warehouse_staff'],
  'batches:delete': ['admin'],
  'batches:dispatch': ['admin', 'pharmacist'],
  'batches:scan': ['admin', 'warehouse_staff'],

  // Import
  'import:upload': ['admin', 'warehouse_staff'],
  'import:logs': ['admin', 'pharmacist', 'inspector'],

  // Export / Reports
  'reports:read': ['admin', 'pharmacist', 'inspector'],
  'reports:export': ['admin', 'pharmacist'],

  // Alerts
  'alerts:read': ['admin', 'pharmacist', 'warehouse_staff', 'inspector'],
  'alerts:resolve': ['admin', 'pharmacist'],

  // Audit
  'audit:read': ['admin', 'inspector'],

  // Integration
  'integration:erp': ['admin'],
  'integration:prescription': ['admin', 'pharmacist'],

  // Warehouses
  'warehouses:read': ['admin', 'pharmacist', 'warehouse_staff', 'inspector'],
  'warehouses:create': ['admin'],
  'warehouses:update': ['admin'],
  'warehouses:delete': ['admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const guard = (permission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const allowedRoles = PERMISSIONS[permission] as readonly string[];
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, `Insufficient permissions for action: ${permission}`);
    }

    next();
  };
};

export const warehouseScopeGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  // Admins and inspectors can access all warehouses
  if (['admin', 'inspector'].includes(req.user.role)) {
    return next();
  }

  // warehouse_staff and pharmacist can only access their assigned warehouse
  const requestedWarehouseId = req.query.warehouseId || req.body?.warehouseId || req.params.warehouseId;

  if (
    requestedWarehouseId &&
    req.user.warehouseId &&
    requestedWarehouseId !== req.user.warehouseId
  ) {
    throw new ApiError(403, 'Access restricted to your assigned warehouse');
  }

  next();
};
