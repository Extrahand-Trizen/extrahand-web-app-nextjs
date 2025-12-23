/**
 * API Client - Base fetch wrapper with authentication
 * Connects to task-connect-relay backend
 */

import { sessionManager } from "@/lib/auth/session";
import { sessionsApi } from "@/lib/api/endpoints/sessions";
import { getApiBaseUrl, CORS_CONFIG, isDevelopment } from "@/lib/config";
import type { ApiError, SessionTokens } from "@/types/api";

// Custom error interface for API errors
interface APIError extends Error {
   status?: number;
   data?: any;
}

const ACCESS_TOKEN_BUFFER_MS = 30_000; // Refresh ~30s before expiry to avoid race conditions
let refreshPromise: Promise<string | null> | null = null;

function storeSessionTokens(tokens?: SessionTokens | null): string | null {
   if (!tokens?.accessToken) {
      return null;
   }

   const expiresAt = tokens.accessTokenExpiresAt
      ? new Date(tokens.accessTokenExpiresAt).getTime()
      : null;
   const refreshExpiresAt = tokens.refreshTokenExpiresAt
      ? new Date(tokens.refreshTokenExpiresAt).getTime()
      : null;

   sessionManager.saveSession({
      isAuthenticated: true,
      accessToken: tokens.accessToken,
      accessTokenExpiresAt: Number.isFinite(expiresAt) ? expiresAt : null,
      refreshToken: tokens.refreshToken ?? null,
      refreshTokenExpiresAt: Number.isFinite(refreshExpiresAt)
         ? refreshExpiresAt
         : null,
      sessionId: tokens.sessionId ?? null,
   });

   return tokens.accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
   if (!refreshPromise) {
      refreshPromise = sessionsApi
         .refresh()
         .then((response) => storeSessionTokens(response?.tokens))
         .catch((error: any) => {
            console.warn("⚠️ Failed to refresh access token:", error);
            if (error?.status === 401) {
               sessionManager.clearSession();
            }
            return null;
         })
         .finally(() => {
            refreshPromise = null;
         });
   }

   return refreshPromise;
}

function redactHeaders(headers: Headers): Record<string, string> {
   const safeEntries = Array.from(headers.entries()).map(([key, value]) =>
      key.toLowerCase() === "authorization" ? [key, "[redacted]"] : [key, value]
   );
   return Object.fromEntries(safeEntries);
}

async function getValidAccessToken(): Promise<string | null> {
   const session = sessionManager.getSession();
   const hasRefreshToken = Boolean(session.refreshToken);

   if (!session.isAuthenticated) {
      if (hasRefreshToken) {
         sessionManager.saveSession({ isAuthenticated: true });
      } else {
         return null;
      }
   }

   if (session.accessToken && session.accessTokenExpiresAt) {
      const expiresIn = session.accessTokenExpiresAt - Date.now();
      if (expiresIn > ACCESS_TOKEN_BUFFER_MS) {
         return session.accessToken;
      }
   }

   if (session.accessToken && !session.accessTokenExpiresAt) {
      return session.accessToken;
   }

   return hasRefreshToken ? refreshAccessToken() : null;
}

/**
 * Base fetch function with authentication
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

      let attemptedRefresh = false;

      const corsConfig =
         CORS_CONFIG[isDevelopment ? "development" : "production"];

      while (true) {
         const headers = new Headers(init.headers || {});
         if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
         }

         const token = await getValidAccessToken().catch((err) => {
            console.warn("⚠️ Failed to obtain access token:", err);
            return null;
         });

         if (token) {
            headers.set("Authorization", `Bearer ${token}`);
         } else {
            headers.delete("Authorization");
            console.log("👤 Proceeding without backend access token");
         }

         console.log("🔧 Making fetch request to:", fullUrl);
         console.log("🔧 Headers:", redactHeaders(headers));

         const res = await fetch(fullUrl, {
            ...init,
            headers,
            ...corsConfig,
         });

         console.log("🔧 Response status:", res.status);

         if (res.status === 401 && token && !attemptedRefresh) {
            attemptedRefresh = true;
            const refreshedToken = await refreshAccessToken();
            if (refreshedToken) {
               console.log("🔄 Retrying request after token refresh");
               continue;
            }
         }

         if (!res.ok) {
            const text = await res.text().catch(() => "");
            let errorData;

            try {
               errorData = JSON.parse(text);
            } catch (e) {
               errorData = { error: text || `HTTP ${res.status}` };
            }

            // Create a more informative error
            const error: APIError = new Error(
               errorData.message || errorData.error || `HTTP ${res.status}`
            );
            error.status = res.status;
            error.data = errorData;

            console.error(`❌ API Error ${res.status}:`, errorData);
            throw error;
         }

         const data = await res.json();
         console.log(`✅ API Success: ${path}`, data);
         return data;
      }
   } catch (error) {
      console.error("🚨 API Error:", error);

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
