import { apiClient } from '@/lib/apiClient';
import { AuditLog, ImportLog, DispatchRecord, PaginationParams } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Dispatch API
export const useDispatchRecords = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['dispatch', params],
    queryFn: async () => {
      const response = await apiClient.get('/dispatch', { params });
      return response.data;
    },
  });
};

export const useDispatchRecord = (id: string) => {
  return useQuery({
    queryKey: ['dispatch', id],
    queryFn: async () => {
      const response = await apiClient.get(`/dispatch/${id}`);
      return response.data.data as DispatchRecord;
    },
    enabled: !!id,
  });
};

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

export const useAuditLog = (id: string) => {
  return useQuery({
    queryKey: ['audit', id],
    queryFn: async () => {
      const response = await apiClient.get(`/audit/${id}`);
      return response.data.data as AuditLog;
    },
    enabled: !!id,
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

// Integration API
export const useERPSync = () => {
  return useMutation({
    mutationFn: async (data: {
      syncType: 'INVENTORY' | 'ORDERS' | 'BATCHES';
      data: Record<string, any>;
    }) => {
      try {
        const response = await apiClient.post('/integration/erp/sync', data);
        toast.success('ERP sync initiated successfully');
        return response.data.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'ERP sync failed';
        toast.error(message);
        throw error;
      }
    },
  });
};

export const usePrescriptionVerify = () => {
  return useMutation({
    mutationFn: async (data: {
      prescriptionId: string;
      patientId: string;
      medicineIds: string[];
    }) => {
      try {
        const response = await apiClient.post(
          '/integration/prescription/verify',
          data
        );
        toast.success('Prescription verified successfully');
        return response.data.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Prescription verification failed';
        toast.error(message);
        throw error;
      }
    },
  });
};
