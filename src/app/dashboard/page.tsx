'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import Navigation from '@/components/Navigation';
import { Product } from '@/types';
import { 
  Star,
  Eye,
  Package
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { products, loadProducts } = useProductStore();
  const { totalItems, totalPrice } = useCartStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Get user's products
  const userProducts = products.filter(product => product.sellerId === user?.id);
  const recentProducts = products.slice(0, 6);


  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}! 🌱
          </h1>
          <p className="mt-2 text-gray-600">
            Ready to discover amazing second-hand treasures or list your own items?
          </p>
        </div>


        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-600" />
                Recent Listings
              </h2>
            </div>
            <div className="p-6">
              {recentProducts.length > 0 ? (
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No products available yet. Be the first to list an item!
                </p>
              )}
            </div>
          </div>

          {/* My Listings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                My Listings
              </h2>
            </div>
            <div className="p-6">
              {userProducts.length > 0 ? (
                <div className="space-y-4">
                  {userProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} isOwner />
                  ))}
                  {userProducts.length > 3 && (
                    <div className="text-center pt-4">
                      <a
                        href="/my-listings"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        View all {userProducts.length} listings →
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't listed any items yet</p>
                  <a
                    href="/products/new"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    List Your First Item
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-green-900">EcoCycle Tips</h3>
              <p className="text-green-700 text-sm">Make the most of your sustainable shopping experience</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">📸</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Great Photos</h4>
                <p className="text-gray-600 text-xs mt-1">Take clear, well-lit photos from multiple angles</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">📝</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Detailed Descriptions</h4>
                <p className="text-gray-600 text-xs mt-1">Include condition, size, and any flaws</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">💰</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Fair Pricing</h4>
                <p className="text-gray-600 text-xs mt-1">Research similar items to set competitive prices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isOwner?: boolean;
}

function ProductCard({ product, isOwner }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate hover:text-green-600">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="text-sm font-semibold text-green-600">
            ₹{product.price}
          </p>
        </div>
        {isOwner && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Your Item
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
