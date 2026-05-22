import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
    // Try to get token from sessionStorage (more secure than localStorage)
    const token = typeof window !== 'undefined' 
      ? sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')
      : null;
    
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

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { 
            withCredentials: true,
            timeout: 10000,
          }
        );
        
        const { accessToken } = refreshResponse.data.data;
        
        // Store token in sessionStorage (HttpOnly cookie is preferred by backend)
        sessionStorage.setItem('accessToken', accessToken);
        
        // Update authorization header
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        onRefreshed(accessToken);
        isRefreshing = false;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        
        isRefreshing = false;
        failedQueue = [];
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
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
