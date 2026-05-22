import { apiClient } from '@/lib/apiClient';
import { Warehouse, Drug, Batch, Alert, ApiResponse, PaginationParams, BatchFilters, AlertFilters } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

// Warehouse API
export const useWarehouses = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['warehouses', params],
    queryFn: async () => {
      const response = await apiClient.get('/warehouses', { params });
      return response.data;
    },
  });
};

export const useWarehouse = (id: string) => {
  return useQuery({
    queryKey: ['warehouses', id],
    queryFn: async () => {
      const response = await apiClient.get(`/warehouses/${id}`);
      return response.data.data as Warehouse;
    },
    enabled: !!id,
  });
};

export const useCreateWarehouse = () => {
  return useMutation({
    mutationFn: async (data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiClient.post('/warehouses', data);
      return response.data.data;
    },
  });
};

export const useUpdateWarehouse = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Warehouse> }) => {
      const response = await apiClient.patch(`/warehouses/${id}`, data);
      return response.data.data;
    },
  });
};

export const useDeleteWarehouse = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/warehouses/${id}`);
      return response.data;
    },
  });
};

// Drug API
export const useDrugs = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['drugs', params],
    queryFn: async () => {
      const response = await apiClient.get('/drugs', { params });
      return response.data;
    },
  });
};

export const useDrug = (id: string) => {
  return useQuery({
    queryKey: ['drugs', id],
    queryFn: async () => {
      const response = await apiClient.get(`/drugs/${id}`);
      return response.data.data as Drug;
    },
    enabled: !!id,
  });
};

export const useCreateDrug = () => {
  return useMutation({
    mutationFn: async (data: Omit<Drug, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiClient.post('/drugs', data);
      return response.data.data;
    },
  });
};

export const useUpdateDrug = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Drug> }) => {
      const response = await apiClient.patch(`/drugs/${id}`, data);
      return response.data.data;
    },
  });
};

export const useDeleteDrug = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/drugs/${id}`);
      return response.data;
    },
  });
};

// Batch API
export const useBatches = (filters?: BatchFilters) => {
  return useQuery({
    queryKey: ['batches', filters],
    queryFn: async () => {
      const response = await apiClient.get('/batches', { params: filters });
      return response.data;
    },
  });
};

export const useBatch = (id: string) => {
  return useQuery({
    queryKey: ['batches', id],
    queryFn: async () => {
      const response = await apiClient.get(`/batches/${id}`);
      return response.data.data as Batch;
    },
    enabled: !!id,
  });
};

export const useCreateBatch = () => {
  return useMutation({
    mutationFn: async (data: Omit<Batch, 'id' | 'importedAt' | 'updatedAt'>) => {
      const response = await apiClient.post('/batches', data);
      return response.data.data;
    },
  });
};

export const useUpdateBatchStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/batches/${id}/status`, { status });
      return response.data.data;
    },
  });
};

export const useDispatchBatch = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { quantity: number; destination: string; prescriptionRef?: string };
    }) => {
      const response = await apiClient.post(`/batches/${id}/dispatch`, data);
      return response.data.data;
    },
  });
};

export const useScanBatch = () => {
  return useMutation({
    mutationFn: async (barcode: string) => {
      const response = await apiClient.post('/batches/scan', { barcode });
      return response.data.data;
    },
  });
};

export const useDeleteBatch = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/batches/${id}`);
      return response.data;
    },
  });
};

// Alert API
export const useAlerts = (filters?: AlertFilters) => {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: async () => {
      const response = await apiClient.get('/alerts', { params: filters });
      return response.data;
    },
  });
};

export const useAlert = (id: string) => {
  return useQuery({
    queryKey: ['alerts', id],
    queryFn: async () => {
      const response = await apiClient.get(`/alerts/${id}`);
      return response.data.data as Alert;
    },
    enabled: !!id,
  });
};

export const useResolveAlert = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/alerts/${id}/resolve`);
      return response.data.data;
    },
  });
};
