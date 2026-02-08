'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { storageService } from '@/lib/storage';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // One-time data reset for version 3 (fixes date parsing issues)
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('ecocycle_version');
      if (version !== '3') {
        localStorage.removeItem('ecocycle_data');
        localStorage.setItem('ecocycle_version', '3');
      }
    }

    // Initialize storage and authentication
    storageService.loadFromLocalStorage();

    // Only initialize sample data if no users exist
    if (storageService.getUsers().length === 0) {
      storageService.initializeSampleData();
    }

    initializeAuth();
    setIsInitialized(true);
  }, [initializeAuth]);

  useEffect(() => {
    // Only redirect after initialization is complete
    if (isInitialized && !isAuthenticated && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  return <>{children}</>;
}
