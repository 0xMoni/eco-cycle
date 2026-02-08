'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import Navigation from '@/components/Navigation';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Save, Loader2 } from 'lucide-react';
import { ProductCategory, Product } from '@/types';
import { storageService } from '@/lib/storage';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum([
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Health & Beauty',
    'Other'
  ] as const),
  price: z.number().min(1, 'Price must be at least ₹1'),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair', 'Poor']),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories: { value: ProductCategory; label: string }[] = [
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { user } = useAuthStore();
  const { updateProduct, loadProducts } = useProductStore();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    loadProducts();
    const foundProduct = storageService.getProductById(productId);

    if (foundProduct) {
      if (user && foundProduct.sellerId !== user.id) {
        toast.error('You can only edit your own listings');
        router.push('/my-listings');
        return;
      }

      setProduct(foundProduct);
      setImageUrl(foundProduct.imageUrl || '');
      reset({
        title: foundProduct.title,
        description: foundProduct.description,
        category: foundProduct.category,
        price: foundProduct.price,
        condition: foundProduct.condition || 'Good',
      });
    } else {
      toast.error('Product not found');
      router.push('/my-listings');
    }
    setIsLoading(false);
  }, [productId, user, router, reset, loadProducts]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const updatedProduct = await updateProduct(productId, {
        ...data,
        imageUrl: imageUrl || undefined,
      });

      if (updatedProduct) {
        toast.success('Product updated successfully!');
        router.push('/my-listings');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('An error occurred while updating your listing');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="/my-listings" />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/my-listings" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
          <p className="mt-1 text-gray-600">
            Update your product details
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo
              </label>
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 text-lg"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-green-600">
                      Click to upload a photo
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG up to 10MB
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Product Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="What are you selling?"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Category & Condition Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition *
                </label>
                <select
                  {...register('condition')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹) *
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Describe your item - include details about condition, size, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
