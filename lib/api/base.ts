/**
 * Base API Client Configuration
 * Handles all API requests with authentication and error handling
 * Uses NEXT_PUBLIC_API_BASE_URL (e.g. API gateway) so production uses env, not localhost.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from '@/lib/auth/firebase';
import { getApiBaseUrl } from '@/lib/config';

let apiInstance: AxiosInstance | null = null;

/**
 * Create or retrieve the API client instance
 * @returns Configured axios instance with base URL and auth headers
 */
export function createApiClient(): AxiosInstance {
  if (apiInstance) {
    return apiInstance;
  }

  const apiBase = getApiBaseUrl().replace(/\/$/, '');
  const baseURL = `${apiBase}/api/v1`;

  apiInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
    withCredentials: true, // Important: Send cookies with requests
  });

  // Add request interceptor for logging (cookies are sent automatically)
  apiInstance.interceptors.request.use(
    async (config) => {
      // Cookies (including JWT session token) are automatically sent with withCredentials: true
      // No need to manually attach Authorization header
      if (typeof window !== 'undefined') {
        console.log('🔐 Making authenticated request to:', config.url);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  apiInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle specific error codes
      if (error.response?.status === 401) {
        // Token expired or invalid - don't auto-redirect, let components handle it
        console.error('Authentication error:', error.message);
      }

      if (error.response?.status === 403) {
        // Permission denied
        console.error('Permission denied:', error.message);
      }

      if (error.response?.status === 404) {
        // Not found
        console.error('Resource not found:', error.message);
      }

      if (error.response?.status >= 500) {
        // Server error
        console.error('Server error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return apiInstance;
}

/**
 * Reset the API client (useful for testing or logout)
 */
export function resetApiClient(): void {
  apiInstance = null;
}
