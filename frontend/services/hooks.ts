import { apiClient } from '@/lib/apiClient';
import { User, ApiResponse, PaginationParams, UserRole, PaginatedResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';

// Permission-based access control
const PERMISSIONS = {
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

  // Reports
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

// Hook to check if user has permission
export const usePermission = (permission: Permission) => {
  const user = useAuthStore(state => state.user);
  
  if (!user) return false;
  
  const allowedRoles = PERMISSIONS[permission] as readonly UserRole[];
  return allowedRoles.includes(user.role);
};

// Hook to get all user permissions
export const useUserPermissions = () => {
  const user = useAuthStore(state => state.user);
  
  if (!user) return [];
  
  const userPermissions: Permission[] = [];
  
  Object.entries(PERMISSIONS).forEach(([permission, roles]) => {
    if (roles.includes(user.role)) {
      userPermissions.push(permission as Permission);
    }
  });
  
  return userPermissions;
};

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
      return response.data as PaginatedResponse<User>;
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
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
