import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { storageService } from '@/lib/storage';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;
  checkout: (userId: string) => Promise<boolean>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addToCart: (product: Product, quantity: number = 1) => {
    try {
      storageService.addToCart(product.id, quantity);
      get().loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },

  removeFromCart: (productId: string) => {
    storageService.removeFromCart(productId);
    get().loadCart();
  },

  updateQuantity: (productId: string, quantity: number) => {
    storageService.updateCartItemQuantity(productId, quantity);
    get().loadCart();
  },

  clearCart: () => {
    storageService.clearCart();
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },

  loadCart: () => {
    const items = storageService.getCartItems();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    set({ items, totalItems, totalPrice });
  },

  checkout: async (userId: string) => {
    const { items } = get();
    try {
      // Create purchases for each item
      for (const item of items) {
        storageService.createPurchase(item.productId, userId);
      }
      
      // Clear the cart
      get().clearCart();
      return true;
    } catch (error) {
      console.error('Checkout error:', error);
      return false;
    }
  },
}));
