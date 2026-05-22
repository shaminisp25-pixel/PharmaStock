// User types
export type UserRole = 'admin' | 'pharmacist' | 'warehouse_staff' | 'inspector';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  warehouseId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accessToken: string;
}

// Warehouse types
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  tempMin: number;
  tempMax: number;
  createdAt: string;
  updatedAt: string;
}

// Drug types
export interface Drug {
  id: string;
  name: string;
  composition?: string;
  manufacturer: string;
  category?: string;
  tempMin: number;
  tempMax: number;
  storageNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Batch types
export type BatchStatus = 'active' | 'dispatched' | 'expired' | 'quarantined';

export interface Batch {
  id: string;
  drugId: string;
  drug?: Drug;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  warehouseId: string;
  warehouse?: Warehouse;
  status: BatchStatus;
  importedById?: string;
  importedAt: string;
  updatedAt: string;
}

// Dispatch Record types
export interface DispatchRecord {
  id: string;
  batchId: string;
  batch?: Batch;
  quantityDispatched: number;
  destination: string;
  prescriptionRef?: string;
  dispatchedById: string;
  dispatchedAt: string;
}

// Alert types
export type AlertType = 'near_expiry' | 'expired' | 'low_stock' | 'temp_breach';

export interface Alert {
  id: string;
  batchId: string;
  batch?: Batch;
  alertType: AlertType;
  message: string;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

// Import Log types
export interface ImportLog {
  id: string;
  filename: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  errors: Record<string, any>[];
  uploadedById: string;
  uploadedAt: string;
}

// Audit Log types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  createdAt: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: any[];
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface BatchFilters extends PaginationParams {
  status?: BatchStatus;
  warehouseId?: string;
  drugId?: string;
  expiryBefore?: string;
  expiryAfter?: string;
}

export interface AlertFilters extends PaginationParams {
  alertType?: AlertType;
  resolved?: boolean;
  warehouseId?: string;
}
