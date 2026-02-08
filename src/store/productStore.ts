import { create } from 'zustand';
import { Product, ProductCategory, ProductFilters } from '@/types';
import { storageService } from '@/lib/storage';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  isLoading: boolean;
  loadProducts: () => void;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'seller' | 'sellerId'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getUserProducts: (userId: string) => Product[];
  applyFilters: (filters: ProductFilters) => void;
  searchProducts: (query: string) => void;
  filterByCategory: (category: ProductCategory | undefined) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  filters: {},
  isLoading: false,

  loadProducts: () => {
    set({ isLoading: true });
    const products = storageService.getProducts();
    set({
      products,
      filteredProducts: products,
      isLoading: false
    });
  },

  addProduct: async (productData) => {
    try {
      const product = storageService.createProduct(productData);
      get().loadProducts();
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    try {
      const product = storageService.updateProduct(id, updates);
      get().loadProducts();
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const success = storageService.deleteProduct(id);
      get().loadProducts();
      return success;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  getUserProducts: (userId: string) => {
    return storageService.getUserProducts(userId);
  },

  applyFilters: (filters: ProductFilters) => {
    const { products } = get();
    let filtered = [...products];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    set({ 
      filteredProducts: filtered, 
      filters 
    });
  },

  searchProducts: (query: string) => {
    const { filters } = get();
    get().applyFilters({ ...filters, searchQuery: query });
  },

  filterByCategory: (category: ProductCategory | undefined) => {
    const { filters } = get();
    get().applyFilters({ ...filters, category });
  },
}));
