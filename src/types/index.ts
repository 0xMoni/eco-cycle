export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  imageUrl?: string;
  sellerId: string;
  seller: User;
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
  // Additional fields from wireframe
  quantity?: number;
  condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  yearOfManufacture?: number;
  brand?: string;
  model?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  weight?: number;
  material?: string;
  color?: string;
  originalPackaging?: boolean;
  manualIncluded?: boolean;
  workingConditionDescription?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Purchase {
  id: string;
  productId: string;
  product: Product;
  buyerId: string;
  buyer: User;
  purchaseDate: Date;
  totalAmount: number;
}

export type ProductCategory = 
  | 'Electronics'
  | 'Clothing'
  | 'Books'
  | 'Home & Garden'
  | 'Sports & Outdoors'
  | 'Toys & Games'
  | 'Automotive'
  | 'Health & Beauty'
  | 'Other';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ProductFilters {
  category?: ProductCategory;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
}
