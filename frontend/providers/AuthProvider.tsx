'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';
import { AuthManager } from '@/lib/authManager';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Handles auth initialization and session persistence
 * Wraps the entire app to ensure proper auth state management
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, login, logout, setAccessToken } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Skip auth check on login/register pages
        if (pathname?.startsWith('/auth/')) {
          setIsInitialized(true);
          return;
        }

        // Check if we have a valid token
        const hasToken = AuthManager.hasValidSession();
        const currentUser = useAuthStore.getState().user;

        if (currentUser && hasToken) {
          // User is already logged in (store was rehydrated)
          setIsInitialized(true);
          return;
        }

        // No user in store, try to refresh token
        if (!hasToken) {
          // No token anywhere, redirect to login
          const storedUser = localStorage.getItem('auth-store');
          
          if (!storedUser) {
            // No persisted auth, redirect to login
            router.push('/auth/login');
            setIsInitialized(true);
            return;
          }

          // Try silent refresh
          const newToken = await AuthManager.refreshAccessToken();
          
          if (newToken) {
            setAccessToken(newToken);
            setIsInitialized(true);
            return;
          }

          // Refresh failed, clear auth
          AuthManager.clearAll();
          logout();
          router.push('/auth/login');
          setIsInitialized(true);
          return;
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        AuthManager.clearAll();
        logout();
        setIsInitialized(false);
      }
    };

    // Add small delay to allow Zustand to hydrate
    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, [pathname, router, logout, setAccessToken]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
