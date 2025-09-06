'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { 
  Leaf, 
  Home, 
  Search, 
  Plus, 
  User, 
  ShoppingCart, 
  Menu, 
  X,
  LogOut,
  Package,
  History
} from 'lucide-react';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const router = useRouter();

  // Debug user object
  console.log('Navigation: user object:', user);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/products', label: 'Browse', icon: Search },
    { href: '/products/new', label: 'Sell', icon: Plus },
    { href: '/my-listings', label: 'My Listings', icon: Package },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/purchases', label: 'Purchases', icon: History },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/mvp-assets/icons/logo.png" 
                alt="EcoCycle Logo" 
                className="h-8 w-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">EcoCycle</span>
                <span className="text-xs text-green-600 -mt-1">Sustainability on Repeat</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label === 'Cart' ? `Cart (${totalItems})` : item.label}</span>
                </Link>
              );
            })}
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label === 'Cart' ? `Cart (${totalItems})` : item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, {user?.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
