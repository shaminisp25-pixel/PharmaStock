/**
 * API Services Layer
 * Typed API endpoints for all resources
 */

import { apiClient } from './api-client';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface Drug {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  temperature: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  drugId: string;
  warehouseId: string;
  quantity: number;
  expiryDate: string;
  batchNumber: string;
  status: 'active' | 'dispatched' | 'expired';
  temperature?: number;
  createdAt: string;
  updatedAt: string;
  drug?: Drug;
  warehouse?: Warehouse;
}

export interface Alert {
  id: string;
  type: 'expiry' | 'stock' | 'temperature' | 'dispatch' | 'import';
  severity: 'critical' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  resourceId?: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  type: string;
  filters: Record<string, any>;
  generatedAt: string;
  expiresAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  temperature?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

export const AuthService = {
  async login(email: string, password: string) {
    return apiClient.post(
      '/auth/login',
      { email, password },
      { skipAuth: true },
    );
  },

  async register(
    name: string,
    email: string,
    password: string,
    role: string,
    warehouseId?: string,
  ) {
    return apiClient.post(
      '/auth/register',
      { name, email, password, role, warehouseId },
      { skipAuth: true },
    );
  },

  async refreshToken() {
    return apiClient.post('/auth/refresh', {});
  },

  async logout() {
    return apiClient.post('/auth/logout', {});
  },

  async changePassword(oldPassword: string, newPassword: string) {
    return apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },
};

// ============================================================================
// DRUGS SERVICE
// ============================================================================

export const DrugService = {
  async getAll(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });
    return apiClient.get<Paginated<Drug>>(`/drugs?${params}`);
  },

  async getById(id: string) {
    return apiClient.get<Drug>(`/drugs/${id}`);
  },

  async create(data: Partial<Drug>) {
    return apiClient.post<Drug>('/drugs', data);
  },

  async update(id: string, data: Partial<Drug>) {
    return apiClient.patch<Drug>(`/drugs/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete(`/drugs/${id}`);
  },

  async search(query: string) {
    return apiClient.get<Drug[]>(`/drugs/search?q=${encodeURIComponent(query)}`);
  },
};

// ============================================================================
// BATCHES SERVICE
// ============================================================================

export const BatchService = {
  async getAll(page = 1, limit = 10, filters?: Record<string, any>) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    return apiClient.get<Paginated<Batch>>(`/batches?${params}`);
  },

  async getById(id: string) {
    return apiClient.get<Batch>(`/batches/${id}`);
  },

  async create(data: Partial<Batch>) {
    return apiClient.post<Batch>('/batches', data);
  },

  async update(id: string, data: Partial<Batch>) {
    return apiClient.patch<Batch>(`/batches/${id}`, data);
  },

  async updateStatus(id: string, status: string) {
    return apiClient.patch<Batch>(`/batches/${id}/status`, { status });
  },

  async dispatch(id: string, data: any) {
    return apiClient.post(`/batches/${id}/dispatch`, data);
  },

  async scanBarcode(barcode: string) {
    return apiClient.post<Batch>('/batches/scan', { barcode });
  },

  async delete(id: string) {
    return apiClient.delete(`/batches/${id}`);
  },

  async getExpiryStats() {
    return apiClient.get<{
      expiringSoon: number;
      expired: number;
      active: number;
    }>('/batches/stats/expiry');
  },
};

// ============================================================================
// USERS SERVICE
// ============================================================================

export const UserService = {
  async getAll(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return apiClient.get<Paginated<any>>(`/users?${params}`);
  },

  async getById(id: string) {
    return apiClient.get(`/users/${id}`);
  },

  async getCurrentUser() {
    return apiClient.get('/users/me');
  },

  async create(data: any) {
    return apiClient.post('/users', data);
  },

  async update(id: string, data: any) {
    return apiClient.patch(`/users/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete(`/users/${id}`);
  },

  async assignRole(id: string, role: string) {
    return apiClient.patch(`/users/${id}/role`, { role });
  },

  async assignWarehouse(id: string, warehouseId: string) {
    return apiClient.patch(`/users/${id}/warehouse`, { warehouseId });
  },
};

// ============================================================================
// ALERTS SERVICE
// ============================================================================

export const AlertService = {
  async getAll(page = 1, limit = 10, filters?: Record<string, any>) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    return apiClient.get<Paginated<Alert>>(`/alerts?${params}`);
  },

  async getById(id: string) {
    return apiClient.get<Alert>(`/alerts/${id}`);
  },

  async resolve(id: string, resolution?: string) {
    return apiClient.patch(`/alerts/${id}/resolve`, { resolution });
  },

  async delete(id: string) {
    return apiClient.delete(`/alerts/${id}`);
  },

  async getStats() {
    return apiClient.get<{
      critical: number;
      error: number;
      warning: number;
      info: number;
    }>('/alerts/stats');
  },
};

// ============================================================================
// AUDIT SERVICE
// ============================================================================

export const AuditService = {
  async getAll(page = 1, limit = 10, filters?: Record<string, any>) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    return apiClient.get<Paginated<AuditLog>>(`/audit?${params}`);
  },

  async export(format: 'csv' | 'json', filters?: Record<string, any>) {
    const params = new URLSearchParams({ format });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}/audit/export?${params}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );

    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },
};

// ============================================================================
// REPORTS SERVICE
// ============================================================================

export const ReportService = {
  async generateExpiry(filters?: Record<string, any>) {
    return apiClient.post('/reports/expiry', filters || {});
  },

  async generateDispatch(filters?: Record<string, any>) {
    return apiClient.post('/reports/dispatch', filters || {});
  },

  async generateStock(filters?: Record<string, any>) {
    return apiClient.post('/reports/stock', filters || {});
  },

  async generateTemperature(filters?: Record<string, any>) {
    return apiClient.post('/reports/temperature', filters || {});
  },

  async export(reportId: string, format: 'pdf' | 'csv') {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}/reports/${reportId}/export?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );

    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },
};

// ============================================================================
// IMPORT SERVICE
// ============================================================================

export const ImportService = {
  async upload(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise<any>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.responseText).data);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}/import`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
      xhr.send(formData);
    });
  },

  async validate(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/import/validate', formData);
  },
};

// ============================================================================
// WAREHOUSE SERVICE
// ============================================================================

export const WarehouseService = {
  async getAll(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return apiClient.get<Paginated<Warehouse>>(`/warehouses?${params}`);
  },

  async getById(id: string) {
    return apiClient.get<Warehouse>(`/warehouses/${id}`);
  },

  async create(data: Partial<Warehouse>) {
    return apiClient.post<Warehouse>('/warehouses', data);
  },

  async update(id: string, data: Partial<Warehouse>) {
    return apiClient.patch<Warehouse>(`/warehouses/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete(`/warehouses/${id}`);
  },
};
