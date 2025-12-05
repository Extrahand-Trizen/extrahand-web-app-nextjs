'use client';

/**
 * Login Page
 * User authentication with email/password and social login
 * NO API CALLS - Just routing
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check screen size for responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogin = () => {
    // Basic validation
    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    // Navigate to onboarding (or dashboard if user has completed onboarding)
    router.push('/onboarding/choose-location-method');
  };

  const handleGoogleLogin = () => {
    // Navigate to onboarding
    router.push('/onboarding/choose-location-method');
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert('Please enter your email address to reset your password.');
      return;
    }
    // Just show a message (no actual password reset)
    alert('Password reset functionality will be available when API is connected.');
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-white p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-2xl">‹</span>
          <span className="text-base font-bold text-secondary-900">Back</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Sign In</h1>
          <p className="text-sm text-secondary-500">Login to your account</p>
        </div>

        <div className="space-y-4 mb-4">
          <Input
            label="Email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-100 disabled:cursor-not-allowed pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-500"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleForgotPassword}
          className="text-sm text-primary-500 font-semibold mb-6 self-end"
        >
          Forgot Password?
        </button>

        <Button
          variant="primary"
          fullWidth
          onClick={handleLogin}
          className="mb-6"
        >
          Login
        </Button>

        <div className="text-center mb-6">
          <p className="text-sm text-secondary-500 mb-4">Or sign up with</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleGoogleLogin}
              className="w-12 h-12 bg-white rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-50 transition-colors"
            >
              <span className="text-xl">G</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary-700">
            Don't have an account?{' '}
            <Link href="/signup" className="text-info-500 font-bold underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card padding="lg" shadow="lg" className="w-full max-w-[480px]">
        <h1 className="text-2xl font-bold text-secondary-900 mb-1 text-center">Sign In</h1>
        <p className="text-sm text-secondary-500 mb-8 text-center">Login to your account</p>

        <div className="space-y-4 mb-4">
          <Input
            label="Email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-100 disabled:cursor-not-allowed pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-500"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleForgotPassword}
          className="text-sm text-primary-500 font-semibold mb-6 self-end"
        >
          Forgot Password?
        </button>

        <Button
          variant="primary"
          fullWidth
          onClick={handleLogin}
          className="mb-6"
        >
          Login
        </Button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-secondary-300"></div>
          <span className="text-sm text-secondary-500 font-semibold">Or sign up with</span>
          <div className="flex-1 h-px bg-secondary-300"></div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="w-12 h-12 bg-white rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-50 transition-colors"
          >
            <span className="text-xl">G</span>
          </button>
        </div>

        <p className="text-sm text-secondary-700 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-info-500 font-bold underline">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}

