'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/src/shared/api';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authApi.isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      setChecking(false);
    }

    console.log('aaaa')
  }, [router]);

  if (checking) return null;

  return <>{children}</>;
}