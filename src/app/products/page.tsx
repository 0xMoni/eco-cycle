'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import Navigation from '@/components/Navigation';
import { Product, ProductCategory } from '@/types';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Package, 
  Star,
  Eye
} from 'lucide-react';

const categories: { value: ProductCategory | 'All'; label: string }[] = [
  { value: 'All', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Books', label: 'Books' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
  { value: 'Toys & Games', label: 'Toys & Games' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Health & Beauty', label: 'Health & Beauty' },
  { value: 'Other', label: 'Other' },
];

export default function ProductsPage() {
  const { 
    filteredProducts, 
    loadProducts, 
    searchProducts, 
    filterByCategory,
    filters 
  } = useProductStore();
  const { addToCart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  useEffect(() => {
    console.log('Products page: Loading products...');
    loadProducts();
  }, [loadProducts]);

  // Force refresh products on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Products page: Force refreshing products...');
      loadProducts();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Products page: filteredProducts changed:', filteredProducts.length);
  }, [filteredProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleCategoryFilter = (category: ProductCategory | 'All') => {
    setSelectedCategory(category);
    if (category === 'All') {
      filterByCategory(undefined);
    } else {
      filterByCategory(category);
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log('Adding product to cart:', product.title);
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/products" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
          <p className="mt-2 text-gray-600">
            Discover amazing second-hand treasures from our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value as ProductCategory | 'All')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none text-black"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to list an item!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-t-lg overflow-hidden cursor-pointer">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-48 object-cover hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-green-600 cursor-pointer">
              {product.title}
            </h3>
          </Link>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">
            ₹{product.price}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>by {product.seller.username}</span>
          <Link 
            href={`/products/${product.id}`}
            className="flex items-center text-green-600 hover:text-green-700"
          >
            <Eye className="h-4 w-4 mr-1" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
