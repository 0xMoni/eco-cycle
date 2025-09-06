'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import { storageService } from '@/lib/storage';
import { 
  Package, 
  Calendar, 
  DollarSign,
  User,
  CheckCircle
} from 'lucide-react';
import { Purchase } from '@/types';

export default function PurchasesPage() {
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (user) {
      const userPurchases = storageService.getUserPurchases(user.id);
      setPurchases(userPurchases);
    }
  }, [user]);

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/purchases" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
          <p className="mt-2 text-gray-600">
            View your past purchases and track your sustainable shopping journey
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <span className="text-2xl font-bold text-blue-600">₹</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Saved</p>
                <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchases List */}
        {purchases.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Purchases</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <PurchaseItem key={purchase.id} purchase={purchase} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No purchases yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to see your purchase history here.
            </p>
          </div>
        )}

        {/* Environmental Impact */}
        {purchases.length > 0 && (
          <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              🌍 Your Environmental Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
              <div>
                <strong>♻️ Items Recycled:</strong> {purchases.length} items given a second life
              </div>
              <div>
                <strong>💰 Money Saved:</strong> Estimated 50% savings vs. new items
              </div>
              <div>
                <strong>🌱 Carbon Footprint:</strong> Reduced by choosing second-hand
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface PurchaseItemProps {
  purchase: Purchase;
}

function PurchaseItem({ purchase }: PurchaseItemProps) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            {purchase.product.imageUrl ? (
              <img
                src={purchase.product.imageUrl}
                alt={purchase.product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {purchase.product.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {purchase.product.category}
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Sold by {purchase.product.seller.username}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  ₹{purchase.totalAmount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
