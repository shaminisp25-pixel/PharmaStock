import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { AuthManager } from './authManager';

// Use a relative base in dev so Next.js can proxy API requests and keep same-origin
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // ms
const MAX_RETRY_DELAY = 10000; // ms

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookie-based auth (HttpOnly cookies)
});

// Track if we're already refreshing token to avoid multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

const onRefreshed = (token: string) => {
  failedQueue.forEach(prom => prom(token));
  failedQueue = [];
};

const addToQueue = (callback: (token: string) => void) => {
  failedQueue.push(callback);
};

// Add request interceptor - adds auth token from memory/session
apiClient.interceptors.request.use(
  (config) => {
    // Don't add Authorization header for auth endpoints (they handle their own auth)
    const publicAuthEndpoints = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/create-super-admin'];
    const isPublicEndpoint = publicAuthEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (isPublicEndpoint) {
      return config;
    }

    // Get token from AuthManager (checks both sessionStorage and localStorage)
    const token = AuthManager.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor - handles token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };
    
    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Token refresh in progress, queue this request
        return new Promise((resolve) => {
          addToQueue((token: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = (originalRequest._retry || 0) + 1;
      isRefreshing = true;

      try {
        const newAccessToken = await AuthManager.refreshAccessToken();
        
        if (newAccessToken) {
          // Update Zustand store
          try {
            useAuthStore.getState().setAccessToken(newAccessToken);
          } catch (e) {
            // Store not available, continue
          }
          
          // Update authorization header
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          onRefreshed(newAccessToken);
          isRefreshing = false;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // Refresh failed, clear auth and redirect to login
      AuthManager.clearAll();
      try {
        useAuthStore.getState().logout();
      } catch (e) {
        // Store not available
      }
      
      isRefreshing = false;
      failedQueue = [];
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      return Promise.reject(error);
    }

    // Handle 429 Too Many Requests - rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY;
      
      toast.error('Too many requests. Please try again later.');
      
      // Implement exponential backoff for automatic retry
      const attempt = (originalRequest._retry || 0) + 1;
      if (attempt < RETRY_ATTEMPTS) {
        originalRequest._retry = attempt;
        await new Promise(resolve => 
          setTimeout(resolve, Math.min(delay * attempt, MAX_RETRY_DELAY))
        );
        return apiClient(originalRequest);
      }
    }

    // Handle 403 Forbidden - permission denied
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
      return Promise.reject(error);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error('Resource not found');
      return Promise.reject(error);
    }

    // Handle 500+ Server errors
    if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // Extract error message from response
    const message = 
      (error.response?.data as any)?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // Only show toast for non-network errors
    if (error.response) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
