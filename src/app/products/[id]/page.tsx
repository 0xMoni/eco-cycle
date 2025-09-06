'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package, 
  User, 
  Calendar, 
  Tag,
  Heart,
  Share2,
  Star
} from 'lucide-react';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getProductById } = useProductStore();
  const { addToCart } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productId = params.id as string;
    if (productId) {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct);
      setIsLoading(false);
    }
  }, [params.id, getProductById]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    router.push('/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === product.sellerId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.category}
                </span>
                {isOwner && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Your Item
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-green-600">
              ₹{product.price}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Seller Information</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.seller.username}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(product.seller.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Listed</dt>
                  <dd className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Condition</dt>
                  <dd className="text-sm text-gray-900">Used - Good</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Availability</dt>
                  <dd className="text-sm text-green-600 font-medium">
                    {product.isAvailable ? 'Available' : 'Sold'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Purchase Actions */}
            {!isOwner && product.isAvailable && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Manage Your Listing</h3>
                <p className="text-blue-700 text-sm mb-3">
                  This is your listing. You can edit or delete it from your listings page.
                </p>
                <button
                  onClick={() => router.push('/my-listings')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage Listing
                </button>
              </div>
            )}

            {!product.isAvailable && (
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-900 mb-2">Item Sold</h3>
                <p className="text-red-700 text-sm">
                  This item is no longer available for purchase.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="text-center py-8 text-gray-500">
            <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Related products will be shown here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
