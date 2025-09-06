'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductStore } from '@/store/productStore';
import Navigation from '@/components/Navigation';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Save, Package } from 'lucide-react';
import { ProductCategory } from '@/types';

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
  price: z.number().min(0.01, 'Price must be greater than 0'),
  // Additional fields from wireframe
  quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair', 'Poor']).optional(),
  yearOfManufacture: z.number().min(1900).max(new Date().getFullYear()).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
  }).optional(),
  weight: z.number().min(0).optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  originalPackaging: z.boolean().optional(),
  manualIncluded: z.boolean().optional(),
  workingConditionDescription: z.string().optional(),
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

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useProductStore();
  const [imageUrl, setImageUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Other',
      price: 0,
      quantity: 1,
      condition: 'Good',
      originalPackaging: false,
      manualIncluded: false,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const product = await addProduct({
        ...data,
        imageUrl: imageUrl || undefined,
        isAvailable: true,
      });

      if (product) {
        toast.success('Product listed successfully!');
        router.push('/my-listings');
      } else {
        toast.error('Failed to create product listing');
      }
    } catch (error) {
      toast.error('An error occurred while creating your listing');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll create a placeholder URL
      // In a real app, you'd upload to a cloud service
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/products/new" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-gray-600">
            List your item for sale and help others find great deals
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Product Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Product Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Vintage Camera, Designer Jacket"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
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
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Describe your item in detail. Include condition, size, any flaws, and why someone would love it..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹) *
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div className="mt-1">
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
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-green-600 hover:text-green-500">
                          Click to upload an image
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  {...register('quantity', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition
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
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  {...register('brand')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Apple, Nike, Samsung"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                )}
              </div>

              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  {...register('model')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., iPhone 12, Air Max 90"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                )}
              </div>

              {/* Year of Manufacture */}
              <div>
                <label htmlFor="yearOfManufacture" className="block text-sm font-medium text-gray-700">
                  Year of Manufacture
                </label>
                <input
                  {...register('yearOfManufacture', { valueAsNumber: true })}
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="2020"
                />
                {errors.yearOfManufacture && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearOfManufacture.message}</p>
                )}
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  {...register('color')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Black, Blue, Red"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
                )}
              </div>

              {/* Material */}
              <div>
                <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                  Material
                </label>
                <input
                  {...register('material')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Cotton, Leather, Plastic"
                />
                {errors.material && (
                  <p className="mt-1 text-sm text-red-600">{errors.material.message}</p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="1.5"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                )}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="dimensions.length" className="block text-xs font-medium text-gray-600">
                    Length
                  </label>
                  <input
                    {...register('dimensions.length', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions.width" className="block text-xs font-medium text-gray-600">
                    Width
                  </label>
                  <input
                    {...register('dimensions.width', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions.height" className="block text-xs font-medium text-gray-600">
                    Height
                  </label>
                  <input
                    {...register('dimensions.height', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  {...register('originalPackaging')}
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="originalPackaging" className="ml-2 block text-sm text-gray-700">
                  Original Packaging Included
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('manualIncluded')}
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="manualIncluded" className="ml-2 block text-sm text-gray-700">
                  Manual/Instructions Included
                </label>
              </div>
            </div>

            {/* Working Condition Description */}
            <div>
              <label htmlFor="workingConditionDescription" className="block text-sm font-medium text-gray-700">
                Working Condition Description
              </label>
              <textarea
                {...register('workingConditionDescription')}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Describe the current working condition, any issues, or special features..."
              />
              {errors.workingConditionDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.workingConditionDescription.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                List Product
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-blue-900">Listing Tips</h3>
              <p className="text-blue-700 text-sm">Make your listing stand out with these pro tips</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Clear Titles</h4>
                <p className="text-gray-600 text-xs mt-1">Use descriptive titles with key details like brand, model, and condition</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Great Photos</h4>
                <p className="text-gray-600 text-xs mt-1">Take photos in good lighting from multiple angles</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Honest Description</h4>
                <p className="text-gray-600 text-xs mt-1">Be transparent about condition and any flaws</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Fair Pricing</h4>
                <p className="text-gray-600 text-xs mt-1">Research similar items to set competitive prices</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">5</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Quick Response</h4>
                <p className="text-gray-600 text-xs mt-1">Respond quickly to buyer inquiries to increase your chances of selling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
