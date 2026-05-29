'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = (matches: boolean) => root.classList.toggle('dark', matches);

      applySystemTheme(media.matches);

      const handleChange = (event: MediaQueryListEvent) => applySystemTheme(event.matches);
      media.addEventListener('change', handleChange);

      return () => media.removeEventListener('change', handleChange);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return <>{children}</>;
}
