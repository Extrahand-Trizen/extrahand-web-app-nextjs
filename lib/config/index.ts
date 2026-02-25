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
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Always default to production backend
  return PRODUCTION_API_URL;
};

// Simple helper to detect client-side development environment
export const isDevClient = (): boolean => {
  if (typeof window === 'undefined') {
    // On the server, rely on NODE_ENV / NEXT_PUBLIC_ENV only
    return process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENV === 'development';
  }
  const envCheck = process.env.NEXT_PUBLIC_ENV === 'development';
  const hostnameCheck = window.location.hostname === 'localhost';
  return envCheck || hostnameCheck;
};

// Environment detection - development by default for local development
export const isDevelopment = isDevClient();

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
