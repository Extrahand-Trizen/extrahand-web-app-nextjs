/**
 * Application Configuration
 * Centralized configuration with environment variable support
 */

// API URL - Production backend URL
const PRODUCTION_API_URL = 'https://extrahandbackend.llp.trizenventures.com';
const LOCAL_API_URL = 'http://localhost:4000';

// API URL - Smart fallback for development vs production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || PRODUCTION_API_URL;

// Always use production backend URL by default
// Use localhost only if explicitly set via environment variable
export const getApiBaseUrl = (): string => {
  // If environment variable is set, use it (allows override for local development)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.log('🔧 Using API URL from environment variable:', process.env.NEXT_PUBLIC_API_BASE_URL);
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Always default to production backend
  console.log('🔧 Using production backend:', PRODUCTION_API_URL);
  return PRODUCTION_API_URL;
};

// Environment detection - development by default for local development
export const isDevelopment = (() => {
  const envCheck = process.env.NEXT_PUBLIC_ENV === 'development';
  const hostnameCheck = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const result = envCheck || hostnameCheck;
  console.log('🔧 isDevelopment check:', {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    envCheck,
    hostnameCheck,
    result
  });
  return result;
})();

// CORS configuration for different environments
export const CORS_CONFIG = {
  development: {
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode,
  },
  production: {
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode,
  }
};

// Firebase configuration (same for both environments)
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "961487777082",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Feature flags
export const FEATURE_FLAGS = {
  enableAnalytics: !isDevelopment,
  enableErrorTracking: !isDevelopment,
  enablePWA: !isDevelopment,
  enableOfflineMode: !isDevelopment,
  showDevBanner: isDevelopment
};
