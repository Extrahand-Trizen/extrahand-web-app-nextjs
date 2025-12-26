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

function redactHeaders(headers: Headers): Record<string, string> {
   const safeEntries = Array.from(headers.entries()).map(([key, value]) =>
      key.toLowerCase() === "authorization" ? [key, "[redacted]"] : [key, value]
   );
   return Object.fromEntries(safeEntries);
}

/**
 * Base fetch function with authentication via HttpOnly cookies
 * Tokens are NOT injected by this client; browser sends them automatically.
 */
async function fetchWithAuth(
   path: string,
   init: RequestInit = {}
): Promise<any> {
   try {
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
   } catch (error) {
      // Only log if it's not already an APIError we created above
      const apiError = error as APIError;
      if (!apiError.status) {
         console.error("🚨 API Error:", error);
      }

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

      // Enhance error with more context
      if (error instanceof Error) {
         error.message = `API call failed: ${error.message}`;
      }

      throw error;
   }
}

export { fetchWithAuth };
