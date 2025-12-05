/**
 * API Client - Base fetch wrapper with authentication
 * Connects to task-connect-relay backend
 */

import { auth } from '@/lib/auth/firebase';
import { getApiBaseUrl, CORS_CONFIG, isDevelopment } from '@/lib/config';
import { ApiError, ApiResponse } from '@/types/api';

// Custom error interface for API errors
interface APIError extends Error {
  status?: number;
  data?: any;
}

/**
 * Base fetch function with authentication
 */
async function fetchWithAuth(path: string, init: RequestInit = {}): Promise<any> {
  try {
    // Ensure no double slashes in URL
    const cleanApiBase = getApiBaseUrl().replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    const fullUrl = `${cleanApiBase}/api/v1/${cleanPath}`;
    
    console.log('🔧 fetchWithAuth called with path:', path);
    console.log('🔧 Full URL:', fullUrl);
    console.log('🔧 Environment:', isDevelopment ? 'development' : 'production');
    
    const user = auth.currentUser;
    
    // Always try to get authentication token if user is logged in
    let authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> || {}),
    };
    
    if (user) {
      try {
        const token = await user.getIdToken();
        authHeaders.Authorization = `Bearer ${token}`;
        console.log('🔐 Using authenticated request with token');
      } catch (tokenError) {
        console.warn('⚠️ Failed to get auth token:', tokenError);
        // Continue without token for development
      }
    } else {
      console.log('👤 No user logged in, proceeding without authentication');
    }
    
    // Add CORS configuration based on environment
    const corsConfig = CORS_CONFIG[isDevelopment ? 'development' : 'production'];
    
    console.log('🔧 Making fetch request to:', fullUrl);
    console.log('🔧 Headers:', authHeaders);
    
    const res = await fetch(fullUrl, {
      ...init,
      headers: authHeaders,
      ...corsConfig,
    });
    
    console.log('🔧 Response status:', res.status);
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let errorData;
      
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        errorData = { error: text || `HTTP ${res.status}` };
      }
      
      // Create a more informative error
      const error: APIError = new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
      error.status = res.status;
      error.data = errorData;
      
      console.error(`❌ API Error ${res.status}:`, errorData);
      throw error;
    }
    
    const data = await res.json();
    console.log(`✅ API Success: ${path}`, data);
    return data;
  } catch (error) {
    console.error('🚨 API Error:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('🚨 Network error detected - possible CORS or connectivity issue');
      console.error('🚨 Check if backend is running and CORS is properly configured');
    }
    
    // Enhance error with more context
    if (error instanceof Error) {
      error.message = `API call failed: ${error.message}`;
    }
    
    throw error;
  }
}

export { fetchWithAuth };
