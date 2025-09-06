'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import { toast } from 'react-hot-toast';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  CreditCard,
  ArrowLeft
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    loadCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    checkout
  } = useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const success = await checkout(user.id);
      if (success) {
        toast.success('Purchase completed! Thank you for shopping sustainably!');
        router.push('/purchases');
      } else {
        toast.error('Checkout failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/cart" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">
            Review your items before checkout
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cart Items ({totalItems})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({totalItems})</span>
                    <span className="text-gray-900">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Total</span>
                      <span className="text-base font-medium text-gray-900">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Secure checkout powered by EcoCycle
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to add items to your cart.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Package className="h-4 w-4 mr-2" />
                Browse Products
              </button>
            </div>
          </div>
        )}

        {/* Eco-friendly message */}
        {items.length > 0 && (
          <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🌱 Thank you for choosing sustainable shopping!
            </h3>
            <p className="text-green-700">
              By purchasing second-hand items, you're helping reduce waste and supporting a circular economy. 
              Every purchase makes a positive impact on our planet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    product: {
      id: string;
      title: string;
      description: string;
      price: number;
      category: string;
      imageUrl?: string;
    };
    quantity: number;
  };
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            {item.product.imageUrl ? (
              <img
                src={item.product.imageUrl}
                alt={item.product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900">
            {item.product.title}
          </h3>
          <p className="text-sm text-gray-500">{item.product.category}</p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {item.product.description}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Price and Remove */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              ₹{(item.product.price * item.quantity).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              ₹{item.product.price} each
            </div>
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
