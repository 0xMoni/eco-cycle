'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import Navigation from '@/components/Navigation';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Eye,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Product } from '@/types';

export default function MyListingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { getUserProducts, deleteProduct, loadProducts } = useProductStore();
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (user) {
      const products = getUserProducts(user.id);
      setUserProducts(products);
    }
  }, [user, getUserProducts]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    setIsDeleting(productId);
    try {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Product deleted successfully');
        // Refresh the list
        if (user) {
          const products = getUserProducts(user.id);
          setUserProducts(products);
        }
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the product');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/products/edit/${productId}`);
  };

  const totalValue = userProducts.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/my-listings" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="mt-2 text-gray-600">
                Manage your product listings and track their performance
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => router.push('/products/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{userProducts.length}</p>
            <p className="text-sm text-gray-500 mt-1">Listings</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-green-600">₹</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{totalValue.toFixed(0)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Value</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Views</p>
          </div>
        </div>

        {/* Products List */}
        {userProducts.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {userProducts.map((product) => (
                <ProductRow 
                  key={product.id} 
                  product={product} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={isDeleting === product.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by listing your first item for sale.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/products/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Your First Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  isDeleting: boolean;
}

function ProductRow({ product, onEdit, onDelete, isDeleting }: ProductRowProps) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
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

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Listed {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  ₹{product.price}
                </div>
                <div className="text-sm text-gray-500">
                  {product.isAvailable ? 'Available' : 'Sold'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(product.id)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Trash2 className="h-4 w-4 mr-1" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
