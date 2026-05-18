/**
 * Authentication Context and Hooks
 * Manages global auth state with token refresh and user data
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { apiClient } from './api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'WAREHOUSE_STAFF' | 'VIEWER';
  warehouseId?: string;
  warehouse?: {
    id: string;
    name: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
    warehouseId?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize auth state from stored data
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const storedUser = apiClient.getUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<{
          id: string;
          email: string;
          name: string;
          role: string;
          accessToken: string;
          refreshToken: string;
        }>('/auth/login', { email, password }, { skipAuth: true });

        if (!response || !response.accessToken) {
          throw new Error('Invalid login response');
        }

        const userData: User = {
          id: response.id,
          email: response.email,
          name: response.name,
          role: response.role as User['role'],
        };

        apiClient.setAuthData(userData, response.accessToken, response.refreshToken);
        setUser(userData);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Login failed. Please check your credentials.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: string,
      warehouseId?: string,
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiClient.post(
          '/auth/register',
          { name, email, password, role, warehouseId },
          { skipAuth: true },
        );
        // Auto-login after registration
        await login(email, password);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/auth/logout', {});
    } catch (err) {
      // Still logout even if API call fails
      console.error('Logout API call failed:', err);
    } finally {
      apiClient.logout();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data from server
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiClient.get<User>('/users/me');
      setUser(userData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh user data';
      setError(message);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && apiClient.isAuthenticated(),
    login,
    register,
    logout,
    refreshUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (requiredRoles: string | string[]): boolean => {
  const { user } = useAuth();
  if (!user) return false;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(user.role);
};

/**
 * Hook to require authentication
 * Redirects to /login if user is not authenticated
 */
export const useRequireAuth = (): User | null => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  // Return null while redirecting or until user is loaded
  if (!isAuthenticated || !user) {
    return null;
  }

  return user;
};
