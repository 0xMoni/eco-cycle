import { User, Product, CartItem, Purchase } from '@/types';

// Simple in-memory storage for demo purposes
// In a real app, this would be replaced with a proper database

class StorageService {
  private users: User[] = [];
  private products: Product[] = [];
  private cartItems: CartItem[] = [];
  private purchases: Purchase[] = [];
  private currentUser: User | null = null;

  // User methods
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    this.saveToLocalStorage();
    return user;
  }

  getUserByEmail(email: string): User | null {
    return this.users.find(user => user.email === email) || null;
  }

  getUserById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveToLocalStorage();
    return this.users[userIndex];
  }

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
    this.saveToLocalStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUsers(): User[] {
    return this.users;
  }

  getProductsCount(): number {
    return this.products.length;
  }

  // Product methods
  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'seller'> | Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'seller' | 'sellerId' | 'isAvailable'>): Product {
    const seller = this.getCurrentUser();
    if (!seller) throw new Error('User must be logged in to create products');

    const product: Product = {
      ...productData,
      id: this.generateId(),
      sellerId: seller.id,
      seller,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAvailable: true,
      // Set default values for new fields
      quantity: productData.quantity || 1,
      condition: productData.condition || 'Good',
      originalPackaging: productData.originalPackaging || false,
      manualIncluded: productData.manualIncluded || false,
    };
    this.products.push(product);
    this.saveToLocalStorage();
    return product;
  }

  // Create product with specific seller (for sample data)
  createProductWithSeller(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'seller' | 'sellerId' | 'isAvailable'>, seller: User): Product {
    const product: Product = {
      ...productData,
      id: this.generateId(),
      sellerId: seller.id,
      seller,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAvailable: true,
      // Set default values for new fields
      quantity: productData.quantity || 1,
      condition: productData.condition || 'Good',
      originalPackaging: productData.originalPackaging || false,
      manualIncluded: productData.manualIncluded || false,
    };
    this.products.push(product);
    this.saveToLocalStorage();
    return product;
  }

  getProducts(): Product[] {
    return this.products.filter(product => product.isAvailable);
  }

  getProductById(id: string): Product | null {
    return this.products.find(product => product.id === id) || null;
  }

  getUserProducts(userId: string): Product[] {
    return this.products.filter(product => product.sellerId === userId);
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveToLocalStorage();
    return this.products[productIndex];
  }

  deleteProduct(id: string): boolean {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    this.products[productIndex].isAvailable = false;
    this.saveToLocalStorage();
    return true;
  }

  // Cart methods
  addToCart(productId: string, quantity: number = 1): CartItem {
    const product = this.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = this.cartItems.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      this.saveToLocalStorage();
      return existingItem;
    }

    const cartItem: CartItem = {
      id: this.generateId(),
      productId,
      product,
      quantity,
      addedAt: new Date(),
    };
    this.cartItems.push(cartItem);
    this.saveToLocalStorage();
    return cartItem;
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  removeFromCart(productId: string): boolean {
    const itemIndex = this.cartItems.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return false;

    this.cartItems.splice(itemIndex, 1);
    this.saveToLocalStorage();
    return true;
  }

  updateCartItemQuantity(productId: string, quantity: number): boolean {
    const item = this.cartItems.find(item => item.productId === productId);
    if (!item) return false;

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    item.quantity = quantity;
    this.saveToLocalStorage();
    return true;
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveToLocalStorage();
  }

  // Purchase methods
  createPurchase(productId: string, buyerId: string): Purchase {
    const product = this.getProductById(productId);
    const buyer = this.getUserById(buyerId);
    if (!product || !buyer) throw new Error('Product or buyer not found');

    const purchase: Purchase = {
      id: this.generateId(),
      productId,
      product,
      buyerId,
      buyer,
      purchaseDate: new Date(),
      totalAmount: product.price,
    };
    this.purchases.push(purchase);

    // Mark product as sold/unavailable
    this.updateProduct(productId, { isAvailable: false });

    this.saveToLocalStorage();
    return purchase;
  }

  getUserPurchases(userId: string): Purchase[] {
    return this.purchases.filter(purchase => purchase.buyerId === userId);
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecocycle_data', JSON.stringify({
        users: this.users,
        products: this.products,
        cartItems: this.cartItems,
        purchases: this.purchases,
        currentUser: this.currentUser,
      }));
    }
  }

  loadFromLocalStorage(): void {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('ecocycle_data');
      if (data) {
        const parsed = JSON.parse(data);
        // Convert date strings back to Date objects
        this.users = (parsed.users || []).map((u: User) => ({
          ...u,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        }));
        this.products = (parsed.products || []).map((p: Product) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          seller: p.seller ? {
            ...p.seller,
            createdAt: new Date(p.seller.createdAt),
            updatedAt: new Date(p.seller.updatedAt),
          } : p.seller,
        }));
        this.cartItems = (parsed.cartItems || []).map((c: CartItem) => ({
          ...c,
          addedAt: new Date(c.addedAt),
          product: c.product ? {
            ...c.product,
            createdAt: new Date(c.product.createdAt),
            updatedAt: new Date(c.product.updatedAt),
          } : c.product,
        }));
        this.purchases = (parsed.purchases || []).map((p: Purchase) => ({
          ...p,
          purchaseDate: new Date(p.purchaseDate),
        }));
        this.currentUser = parsed.currentUser ? {
          ...parsed.currentUser,
          createdAt: new Date(parsed.currentUser.createdAt),
          updatedAt: new Date(parsed.currentUser.updatedAt),
        } : null;
      }
    }
  }

  // Clear all data and reinitialize
  clearAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecocycle_data');
      localStorage.removeItem('ecofinds_data');
    }
    this.users = [];
    this.products = [];
    this.cartItems = [];
    this.purchases = [];
    this.currentUser = null;
  }

  // Initialize with sample data
  initializeSampleData(): void {
    if (this.users.length === 0) {
      // Create sample users
      const user1 = this.createUser({
        email: 'demo@ecofinds.com',
        username: 'DemoUser',
      });

      const user2 = this.createUser({
        email: 'seller@ecofinds.com',
        username: 'EcoSeller',
      });

      const user3 = this.createUser({
        email: 'buyer@ecofinds.com',
        username: 'GreenBuyer',
      });

      // Set current user to DemoUser for login
      this.setCurrentUser(user1);
      
      // Create one product from each category
      this.createProductWithSeller({
        title: 'iPhone 12 Pro',
        description: 'Excellent condition iPhone 12 Pro, 128GB, Space Gray. Includes original charger and case.',
        category: 'Electronics',
        price: 45000,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        condition: 'Like New',
        brand: 'Apple',
        model: 'iPhone 12 Pro',
        yearOfManufacture: 2020,
        color: 'Space Gray',
        originalPackaging: true,
        manualIncluded: true,
        workingConditionDescription: 'Fully functional, no scratches, battery health 95%',
      }, user2);

      this.createProductWithSeller({
        title: 'Levi\'s 501 Jeans',
        description: 'Classic blue denim jeans, size 32. Gently worn, perfect fit.',
        category: 'Clothing',
        price: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        condition: 'Good',
        brand: 'Levi\'s',
        model: '501',
        color: 'Blue',
        material: 'Denim',
        quantity: 1,
      }, user1);

      this.createProductWithSeller({
        title: 'Atomic Habits by James Clear',
        description: 'Hardcover edition in excellent condition. Life-changing book about building good habits.',
        category: 'Books',
        price: 800,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      }, user3);

      this.createProductWithSeller({
        title: 'Indoor Plant Collection',
        description: 'Set of 5 beautiful indoor plants including Monstera, Snake Plant, and Pothos.',
        category: 'Home & Garden',
        price: 2000,
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      }, user1);

      this.createProductWithSeller({
        title: 'Yoga Mat Premium',
        description: 'High-quality yoga mat, non-slip surface. Perfect for home workouts.',
        category: 'Sports & Outdoors',
        price: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      }, user2);

      this.createProductWithSeller({
        title: 'LEGO Creator Set',
        description: 'Complete LEGO Creator set, 1000+ pieces. Perfect for kids and adults.',
        category: 'Toys & Games',
        price: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1558060370-9e0b0d2a2a5a?w=400',
      }, user3);

      this.createProductWithSeller({
        title: 'Car Phone Mount',
        description: 'Magnetic phone mount for car dashboard. Universal compatibility.',
        category: 'Automotive',
        price: 800,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      }, user1);

      this.createProductWithSeller({
        title: 'Skincare Set',
        description: 'Complete skincare routine set. Natural ingredients, gentle on skin.',
        category: 'Health & Beauty',
        price: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400',
      }, user2);

      this.createProductWithSeller({
        title: 'Vintage Vinyl Records',
        description: 'Collection of 20 vintage vinyl records. Classic rock and jazz albums.',
        category: 'Other',
        price: 4000,
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      }, user3);
    }
  }
}

export const storageService = new StorageService();
