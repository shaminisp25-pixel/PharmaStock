'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Replace instead of push to avoid stacking in history
    router.replace('/dashboard');
  }, [router]);

  return null;
}
