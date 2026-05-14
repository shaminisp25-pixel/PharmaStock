/**
 * Secure HTTP Client with Token Management
 * Production-level API integration with:
 * - Automatic token refresh
 * - Request/response interceptors
 * - Error handling and retry logic
 * - Rate limiting support
 */

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  retryCount?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: any;
  };
}

interface ApiError {
  status: number;
  message: string;
  code: string;
  retryable: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';

class HttpClient {
  private baseUrl: string;
  private tokenRefreshPromise: Promise<string> | null = null;

  constructor() {
    this.baseUrl = `${API_URL}${API_PREFIX}`;
  }

  /**
   * Get stored access token
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('access_token');
    } catch {
      return null;
    }
  }

  /**
   * Store tokens securely
   */
  private setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            this.clearTokens();
            this.redirectToLogin();
          }
          throw new Error('Token refresh failed');
        }

        const data: ApiResponse<{ accessToken: string }> = await response.json();
        const newAccessToken = data.data?.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token in response');
        }

        this.setTokens(newAccessToken);
        return newAccessToken;
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    return this.tokenRefreshPromise;
  }

  /**
   * Get stored refresh token
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('refresh_token');
    } catch {
      return null;
    }
  }

  /**
   * Redirect to login on auth failure
   */
  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Build request headers with authentication
   */
  private buildHeaders(
    options: RequestOptions = {},
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!options.skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Determine if error is retryable
   */
  private isRetryable(status: number): boolean {
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  /**
   * Get retry delay (exponential backoff)
   */
  private getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }

  /**
   * Make HTTP request with retry logic and token refresh
   */
  private async makeRequest<T>(
    url: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { retryCount = 0, skipAuth = false, ...fetchOptions } = options;
    const maxRetries = 3;

    try {
      const headers = this.buildHeaders({ skipAuth });
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...(fetchOptions.headers as Record<string, string>),
        },
        credentials: 'include',
      });

      // Handle token expiration
      if (response.status === 401 && !skipAuth) {
        try {
          const newToken = await this.refreshAccessToken();
          // Retry request with new token
          return this.makeRequest(url, {
            ...options,
            retryCount: retryCount + 1,
          });
        } catch (error) {
          this.clearTokens();
          this.redirectToLogin();
          throw this.handleError(response);
        }
      }

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get('Retry-After') || '60',
        );
        if (retryCount < 1) {
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return this.makeRequest(url, { ...options, retryCount: retryCount + 1 });
        }
      }

      // Retry on server errors
      if (this.isRetryable(response.status) && retryCount < maxRetries) {
        const delay = this.getRetryDelay(retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(url, { ...options, retryCount: retryCount + 1 });
      }

      if (!response.ok) {
        throw this.handleError(response);
      }

      const data: ApiResponse<T> = await response.json();

      if (!data.success && data.error) {
        const error = new Error(data.message) as Error & { code: string };
        error.code = data.error.code;
        throw error;
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Handle API errors
   */
  private handleError(response: Response): ApiError {
    const statusText = response.statusText || 'Unknown Error';

    const errorMap: Record<number, string> = {
      400: 'Bad Request - Please check your input',
      401: 'Unauthorized - Please log in again',
      403: 'Forbidden - You do not have permission',
      404: 'Not Found - Resource does not exist',
      409: 'Conflict - Resource already exists',
      429: 'Too Many Requests - Please try again later',
      500: 'Server Error - Please try again later',
      502: 'Bad Gateway - Service temporarily unavailable',
      503: 'Service Unavailable - Please try again later',
      504: 'Gateway Timeout - Please try again later',
    };

    const message = errorMap[response.status] || statusText;

    return {
      status: response.status,
      message,
      code: `HTTP_${response.status}`,
      retryable: this.isRetryable(response.status),
    };
  }

  /**
   * Public GET method
   */
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Public POST method
   */
  async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Public PATCH method
   */
  async patch<T>(
    url: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Public DELETE method
   */
  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Store authentication data
   */
  setAuthData(user: any, accessToken: string, refreshToken: string): void {
    this.setTokens(accessToken, refreshToken);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to store user:', error);
      }
    }
  }

  /**
   * Get stored user data
   */
  getUser(): any {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Logout - clear all stored data
   */
  logout(): void {
    this.clearTokens();
  }
}

export const apiClient = new HttpClient();
