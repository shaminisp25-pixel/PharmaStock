import { apiClient } from '@/lib/apiClient';
import { User, ApiResponse, PaginationParams } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

// Auth API
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) => {
      const response = await apiClient.post('/auth/register', data);
      return response.data.data;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiClient.post('/auth/changePassword', data);
      return response.data;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    },
  });
};

// User API
export const useUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await apiClient.get('/users', { params });
      return response.data.data as ApiResponse<User[]>;
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data.data as User;
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      role: string;
      warehouseId?: string;
    }) => {
      const response = await apiClient.post('/users', data);
      return response.data.data;
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<User>;
    }) => {
      const response = await apiClient.patch(`/users/${id}`, data);
      return response.data.data;
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    },
  });
};
