'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { storageService } from '@/lib/storage';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize storage and authentication
    storageService.loadFromLocalStorage();
    
    // Only initialize sample data if no data exists
    if (storageService.getUsers().length === 0 || storageService.getProductsCount() === 0) {
      console.log('No users or products found, initializing sample data');
      storageService.initializeSampleData();
    } else {
      console.log('Data found, skipping sample data initialization');
    }
    
    initializeAuth();
    
    // Expose storageService to window for debugging
    if (typeof window !== 'undefined') {
      (window as any).storageService = storageService;
    }
  }, [initializeAuth]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
