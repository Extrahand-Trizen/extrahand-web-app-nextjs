'use client';

/**
 * Sign Up Page
 * User registration with email/password and social signup
 * NO API CALLS - Just routing
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatPhoneNumber } from '@/lib/utils/phone';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check screen size for responsive layout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSignUp = () => {
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (!agree) {
      alert('Please agree to the Terms & Conditions.');
      return;
    }

    // Navigate to OTP verification (or directly to onboarding if phone is optional)
    if (phone) {
      const formattedPhone = formatPhoneNumber(phone);
      router.push(`/otp-verification?phone=${encodeURIComponent(formattedPhone)}`);
    } else {
      // If no phone, go directly to onboarding
      router.push('/onboarding/choose-location-method');
    }
  };

  const handleGoogleSignUp = () => {
    // Navigate to onboarding
    router.push('/onboarding/choose-location-method');
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
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">Create Account</h1>
          <p className="text-base text-secondary-500">Sign up to get started</p>
        </div>

        <div className="space-y-5 mb-6">
          <Input
            label="Name"
            type="text"
            placeholder="Ex. John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="8985******"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-100 disabled:cursor-not-allowed pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-500"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setAgree(!agree)}
            className={`
              w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
              ${agree ? 'bg-primary-500 border-primary-500' : 'border-secondary-300'}
            `}
          >
            {agree && <span className="text-white text-sm font-bold">✓</span>}
          </button>
          <label className="text-sm text-secondary-700 flex-1">
            Agree with{' '}
            <span className="text-primary-500 font-bold">Terms & Conditions</span>
          </label>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleSignUp}
          disabled={!agree}
          className="mb-6"
        >
          Sign Up
        </Button>

        <div className="text-center mb-6">
          <p className="text-sm text-secondary-500 mb-4">Or sign up with</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleGoogleSignUp}
              className="w-12 h-12 bg-white rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-50 transition-colors"
            >
              <span className="text-xl">G</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary-700">
            Already have an account?{' '}
            <Link href="/login" className="text-info-500 font-bold underline">
              Sign In
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
        <h1 className="text-2xl font-bold text-secondary-900 mb-1 text-center">Create Account</h1>
        <p className="text-sm text-secondary-500 mb-8 text-center">Sign up to get started</p>

        <div className="space-y-4 mb-4">
          <Input
            label="Name"
            type="text"
            placeholder="Ex. John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="8985******"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-100 disabled:cursor-not-allowed pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-500"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setAgree(!agree)}
            className={`
              w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
              ${agree ? 'bg-primary-500 border-primary-500' : 'border-secondary-300'}
            `}
          >
            {agree && <span className="text-white text-sm font-bold">✓</span>}
          </button>
          <label className="text-sm text-secondary-700">
            Agree with{' '}
            <span className="text-primary-500 font-bold">Terms & Conditions</span>
          </label>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleSignUp}
          disabled={!agree}
          className="mb-6"
        >
          Sign Up
        </Button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-secondary-300"></div>
          <span className="text-sm text-secondary-500 font-semibold">Or sign up with</span>
          <div className="flex-1 h-px bg-secondary-300"></div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleGoogleSignUp}
            className="w-12 h-12 bg-white rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-50 transition-colors"
          >
            <span className="text-xl">G</span>
          </button>
        </div>

        <p className="text-sm text-secondary-700 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-info-500 font-bold underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}

