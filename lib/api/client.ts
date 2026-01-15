/**
 * API Client - Base fetch wrapper with authentication via HttpOnly cookies
 * Connects to task-connect-relay backend
 * 
 * SECURITY: Tokens are stored in HttpOnly cookies, not accessed by JavaScript.
 * The browser automatically sends cookies with credentials: 'include'.
 */

import { getApiBaseUrl, CORS_CONFIG, isDevelopment } from "@/lib/config";
import type { ApiError } from "@/types/api";

// Custom error interface for API errors
interface APIError extends Error {
   status?: number;
   data?: any;
}

const ACCESS_TOKEN_BUFFER_MS = 30_000;

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: Array<(error?: Error) => void> = [];

/**
 * Subscribe to refresh completion
 * Used to queue requests while a refresh is in progress
 */
function subscribeToRefresh(callback: (error?: Error) => void): void {
   refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers when refresh completes
 */
function notifyRefreshSubscribers(error?: Error): void {
   refreshSubscribers.forEach((callback) => callback(error));
   refreshSubscribers = [];
}

/**
 * Attempt to refresh the access token using the refresh token
 * Returns true if refresh succeeded, false otherwise
 */
async function refreshAccessToken(): Promise<boolean> {
   // If already refreshing, wait for the in-flight refresh to complete
   if (isRefreshing) {
      return new Promise<boolean>((resolve) => {
         subscribeToRefresh((error) => {
            resolve(!error);
         });
      });
   }

   isRefreshing = true;

   try {
      console.log("🔄 Attempting to refresh access token...");
      
      // Dynamically import to avoid circular dependencies
      const { sessionsApi } = await import("@/lib/api/endpoints/sessions");
      const { sessionManager } = await import("@/lib/auth/session");

      // Check if we're still authenticated before attempting refresh
      if (!sessionManager.isSessionActive()) {
         console.warn("⚠️ Session not active, skipping refresh");
         throw new Error("Session not active");
      }

      // Call the refresh endpoint (refresh token is in httpOnly cookie)
      await sessionsApi.refresh();
      
      console.log("✅ Access token refreshed successfully");
      
      // Notify waiting requests that refresh succeeded
      notifyRefreshSubscribers();
      
      return true;
   } catch (error) {
      console.error("❌ Failed to refresh access token:", error);
      
      // Notify waiting requests that refresh failed
      notifyRefreshSubscribers(error as Error);
      
      // Handle auth error - clear session and optionally redirect
      const { sessionManager } = await import("@/lib/auth/session");
      sessionManager.handleAuthError({ redirect: true });
      
      return false;
   } finally {
      isRefreshing = false;
   }
}

function redactHeaders(headers: Headers): Record<string, string> {
   const safeEntries = Array.from(headers.entries()).map(([key, value]) =>
      key.toLowerCase() === "authorization" ? [key, "[redacted]"] : [key, value]
   );
   return Object.fromEntries(safeEntries);
}

/**
 * Internal fetch function that performs the actual HTTP request
 * Used by fetchWithAuth wrapper
 */
async function _fetchWithAuth(
   path: string,
   init: RequestInit = {}
): Promise<any> {
   // Ensure no double slashes in URL
   const cleanApiBase = getApiBaseUrl().replace(/\/$/, "");
   const cleanPath = path.replace(/^\//, "");
   const fullUrl = `${cleanApiBase}/api/v1/${cleanPath}`;

   console.log("🔧 fetchWithAuth called with path:", path);
   console.log("🔧 Full URL:", fullUrl);
   console.log(
      "🔧 Environment:",
      isDevelopment ? "development" : "production"
   );

   const corsConfig =
      CORS_CONFIG[isDevelopment ? "development" : "production"];

   const headers = new Headers(init.headers || {});
   if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
   }

   console.log("🔧 Making fetch request to:", fullUrl);
   console.log("🔧 Headers:", redactHeaders(headers));
   console.log(
      "🔧 HttpOnly cookies will be sent automatically with credentials: 'include'"
   );

   const res = await fetch(fullUrl, {
      ...init,
      headers,
      ...corsConfig,
   });

   console.log("🔧 Response status:", res.status);

   if (!res.ok) {
      const text = await res.text().catch(() => "");
      let errorData: any;

      try {
         errorData = JSON.parse(text);
      } catch (e) {
         errorData = { error: text || `HTTP ${res.status}` };
      }

      // Extract error message from backend format
      // Backend uses: { success: false, error: "message", details?: "...", context?: "..." }
      let errorMessage = 
         errorData.error || 
         errorData.message || 
         errorData.details ||
         `HTTP ${res.status}`;
      
      // If there's additional context/details, append it
      if (errorData.details && errorData.error && errorData.details !== errorData.error) {
         errorMessage = `${errorData.error}: ${errorData.details}`;
      }

      // Create a more informative error
      const error: APIError = new Error(errorMessage);
      error.status = res.status;
      error.data = errorData;

      // Only log as error for unexpected status codes (not auth errors)
      if (res.status === 401 || res.status === 403) {
         // Auth/permission errors are often expected, use warn
         console.warn(`⚠️ API ${res.status}:`, errorMessage);
      } else {
         console.error(`❌ API Error ${res.status}:`, errorData);
      }
      throw error;
   }

   const data = await res.json();
   console.log(`✅ API Success: ${path}`, data);
   return data;
}

/**
 * Base fetch function with authentication via HttpOnly cookies
 * Automatically refreshes access token on 401 errors and retries the request
 */
async function fetchWithAuth(
   path: string,
   init: RequestInit = {}
): Promise<any> {
   try {
      // Attempt the request
      return await _fetchWithAuth(path, init);
   } catch (error) {
      const apiError = error as APIError;
      
      // Check if this is a 401 error (expired access token)
      // Don't retry if this is the refresh endpoint itself to avoid infinite loops
      const isAuthError = apiError.status === 401;
      const isRefreshEndpoint = path.includes("sessions/refresh");
      const shouldRetryWithRefresh = isAuthError && !isRefreshEndpoint;

      if (shouldRetryWithRefresh) {
         console.log("🔄 Access token expired, attempting refresh...");
         
         // Attempt to refresh the access token
         const refreshSucceeded = await refreshAccessToken();
         
         if (refreshSucceeded) {
            console.log("🔄 Retrying original request with new access token...");
            
            // Retry the original request with the new access token
            // The new token is in httpOnly cookies, so no need to modify headers
            try {
               return await _fetchWithAuth(path, init);
            } catch (retryError) {
               console.error("❌ Retry failed after token refresh:", retryError);
               throw retryError;
            }
         } else {
            console.error("❌ Token refresh failed, user needs to re-authenticate");
            throw error;
         }
      }

      // For non-401 errors or refresh endpoint errors, throw immediately
      // Check if it's a network error
      if (
         error instanceof TypeError &&
         error.message.includes("Failed to fetch")
      ) {
         console.error(
            "🚨 Network error detected - possible CORS or connectivity issue"
         );
         console.error(
            "🚨 Check if backend is running and CORS is properly configured"
         );
      }

      // Only log if it's not already an APIError we created in _fetchWithAuth
      if (!apiError.status) {
         console.error("🚨 API Error:", error);
      }

      // Enhance error with more context
      if (error instanceof Error && !error.message.includes("API call failed")) {
         error.message = `API call failed: ${error.message}`;
      }

      throw error;
   }
}

/**
 * Public fetch function for endpoints that don't require authentication
 * Does NOT send authentication cookies
 */
async function fetchPublic(
   path: string,
   init: RequestInit = {}
): Promise<any> {
   try {
      const cleanApiBase = getApiBaseUrl().replace(/\/$/, "");
      const cleanPath = path.replace(/^\//, "");
      const fullUrl = `${cleanApiBase}/api/v1/${cleanPath}`;

      console.log("🔧 fetchPublic called with path:", path);
      console.log("🔧 Full URL:", fullUrl);

      const headers = new Headers(init.headers || {});
      if (!headers.has("Content-Type")) {
         headers.set("Content-Type", "application/json");
      }

      console.log("🔧 Making public fetch request to:", fullUrl);
      console.log("🔧 Credentials:", "omit (no cookies will be sent)");

      const res = await fetch(fullUrl, {
         ...init,
         headers,
         credentials: 'omit', // Explicitly prevent sending cookies
      });

      console.log("🔧 Response status:", res.status);

      if (!res.ok) {
         const text = await res.text().catch(() => "");
         let errorData: any;

         try {
            errorData = JSON.parse(text);
         } catch (e) {
            errorData = { error: text || `HTTP ${res.status}` };
         }

         let errorMessage = 
            errorData.error || 
            errorData.message || 
            errorData.details ||
            `HTTP ${res.status}`;
         
         if (errorData.details && errorData.error && errorData.details !== errorData.error) {
            errorMessage = `${errorData.error}: ${errorData.details}`;
         }

         const error: APIError = new Error(errorMessage);
         error.status = res.status;
         error.data = errorData;

         console.error(`❌ Public API Error ${res.status}:`, errorData);
         throw error;
      }

      const data = await res.json();
      console.log(`✅ Public API Success: ${path}`, data);
      return data;
   } catch (error) {
      const apiError = error as APIError;
      if (!apiError.status) {
         console.error("🚨 Public API Error:", error);
      }

      if (
         error instanceof TypeError &&
         error.message.includes("Failed to fetch")
      ) {
         console.error(
            "🚨 Network error detected - possible CORS or connectivity issue"
         );
         console.error(
            "🚨 Check if backend is running and CORS is properly configured"
         );
      }

      if (error instanceof Error) {
         error.message = `Public API call failed: ${error.message}`;
      }

      throw error;
   }
}

export { fetchWithAuth, fetchPublic };
