'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';

interface RootLayoutClientProps {
  children: ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
