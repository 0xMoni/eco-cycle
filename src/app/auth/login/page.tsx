'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { login, register, isLoading } = useAuthStore();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    try {
      let success = false;
      
      if (isLogin) {
        const loginData = data as LoginFormData;
        success = await login(loginData.email, loginData.password);
        if (success) {
          toast.success('Login successful!');
          router.push('/dashboard');
        } else {
          toast.error('Invalid email or password');
        }
      } else {
        const signupData = data as SignupFormData;
        success = await register(signupData.email, signupData.password, signupData.displayName);
        if (success) {
          toast.success('Registration successful!');
          router.push('/dashboard');
        } else {
          toast.error('Email already exists');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 p-2 flex items-center justify-center">
              <img
                src="/mvp-assets/icons/logo.png"
                alt="EcoCycle Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome back to ' : 'Join '}
            <span className="text-green-600">EcoCycle</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin
              ? 'Sign in to continue to your account'
              : 'Create your account to start buying and selling'}
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-8 border border-gray-200">

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Display Name - Only for Signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    {...registerForm('displayName')}
                    type="text"
                    autoComplete="name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your display name"
                  />
                  {(errors as any).displayName && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).displayName.message}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  {...registerForm('email')}
                  type="email"
                  autoComplete="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...registerForm('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password - Only for Signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...registerForm('confirmPassword')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {(errors as any).confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).confirmPassword.message}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>

            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => toast.error('Please contact support to reset your password')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-green-600 hover:text-green-500 font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
