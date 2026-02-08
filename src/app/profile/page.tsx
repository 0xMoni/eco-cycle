'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import Navigation from '@/components/Navigation';
import { toast } from 'react-hot-toast';
import { User, Save, Mail, Calendar, Package } from 'lucide-react';

const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { products } = useProductStore();
  const [isEditing, setIsEditing] = useState(false);

  // Get user's products and calculate total value
  const userProducts = products.filter(product => product.sellerId === user?.id);
  const totalValue = userProducts.reduce((sum, product) => sum + product.price, 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const success = await updateProfile(data);
      if (success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating your profile');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      username: user?.username || '',
      email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      username: user?.username || '',
      email: user?.email || '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/profile" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.username}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Update your account details and preferences
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    {isEditing ? (
                      <input
                        {...register('username')}
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your username"
                      />
                    ) : (
                      <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{user?.username}</span>
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    {isEditing ? (
                      <input
                        {...register('email')}
                        type="email"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{user?.email}</span>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
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
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Package className="h-7 w-7 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{userProducts.length}</p>
                <p className="text-sm text-gray-500 mt-1">Listings</p>
              </div>

              <div className="bg-white rounded-xl shadow p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-green-600">₹</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">₹{totalValue.toFixed(0)}</p>
                <p className="text-sm text-gray-500 mt-1">Total Value</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
