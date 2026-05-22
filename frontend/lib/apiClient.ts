import axios, { AxiosError, AxiosInstance } from 'axios';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = refreshResponse.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request
        if (error.config) {
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(error.config);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }

    const message = (error.response?.data as any)?.message || 'An error occurred';
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    });

    return Promise.reject(error);
  }
);
