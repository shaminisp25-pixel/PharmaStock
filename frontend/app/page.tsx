'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">💊</div>
        <h1 className="text-4xl font-bold text-primary mb-2">PharmaStock</h1>
        <p className="text-text-secondary text-lg">Pharmaceutical Warehouse Management System</p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="inline-block animate-spin text-primary text-2xl">⟳</span>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    </div>
  );
}
