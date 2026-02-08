'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import {
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

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/products', label: 'Browse', icon: Search },
    { href: '/products/new', label: 'Sell', icon: Plus },
    { href: '/my-listings', label: 'My Listings', icon: Package },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: totalItems },
    { href: '/purchases', label: 'Purchases', icon: History },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-green-50 p-1.5 flex items-center justify-center">
              <img
                src="/mvp-assets/icons/logo.png"
                alt="EcoCycle Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">Eco<span className="text-green-600">Cycle</span></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, <span className="font-medium text-gray-900">{user?.username || 'Guest'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Cart icon with badge on mobile */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100">
          <div className="px-4 py-3 space-y-1 bg-white">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="px-4 py-2 text-sm text-gray-600">
                Signed in as <span className="font-medium text-gray-900">{user?.username || 'Guest'}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
