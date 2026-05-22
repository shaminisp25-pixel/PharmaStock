import { apiClient } from '@/lib/apiClient';
import { AuditLog, ImportLog, PaginationParams } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

// Audit API
export const useAuditLogs = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: async () => {
      const response = await apiClient.get('/audit', { params });
      return response.data;
    },
  });
};

// Import API
export const useImportLogs = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['import-logs', params],
    queryFn: async () => {
      const response = await apiClient.get('/import/logs', { params });
      return response.data;
    },
  });
};

export const useImportLog = (id: string) => {
  return useQuery({
    queryKey: ['import-logs', id],
    queryFn: async () => {
      const response = await apiClient.get(`/import/logs/${id}`);
      return response.data.data as ImportLog;
    },
    enabled: !!id,
  });
};

export const useUploadBatches = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/import/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
  });
};

export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get('/import/template', {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};

// Reports API
export const useExpiryReport = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get('/reports/expiry', {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};

export const useDispatchReport = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get('/reports/dispatch', {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};

export const useStockReport = () => {
  return useQuery({
    queryKey: ['reports', 'stock'],
    queryFn: async () => {
      const response = await apiClient.get('/reports/stock');
      return response.data.data;
    },
  });
};
