/**
 * Base API Client Configuration
 * Handles all API requests with authentication and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

let apiInstance: AxiosInstance | null = null;

/**
 * Create or retrieve the API client instance
 * @returns Configured axios instance with base URL and auth headers
 */
export function createApiClient(): AxiosInstance {
  if (apiInstance) {
    return apiInstance;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api/v1';

  apiInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
  });

  // Add request interceptor to attach auth token
  apiInstance.interceptors.request.use(
    (config) => {
      // Get token from localStorage, cookies, or session storage
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
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
