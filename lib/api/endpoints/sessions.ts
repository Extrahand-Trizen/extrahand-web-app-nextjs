import { getApiBaseUrl } from "@/lib/config";
import { sessionManager } from "@/lib/auth/session";
import type { SessionResponse } from "@/types/api";

interface SessionApiError extends Error {
   status?: number;
   data?: any;
}
async function request<T>(path: string, init?: RequestInit): Promise<T> {
   const cleanApiBase = getApiBaseUrl().replace(/\/$/, "");
   const cleanPath = path.replace(/^\//, "");
   const url = `${cleanApiBase}/api/v1/${cleanPath}`;

   const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         ...(init?.headers || {}),
      },
      ...init,
   });

   const data = await response.json().catch(() => ({}));

   if (!response.ok) {
      const message =
         (data as any)?.error ||
         (data as any)?.message ||
         "Session request failed";
      const error: SessionApiError = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
   }

   return data as T;
}

export const sessionsApi = {
   refresh(): Promise<SessionResponse> {
      const session = sessionManager.getSession();
      const payload: Record<string, any> = {
         clientType: "web",
      };

      if (session.refreshToken) {
         payload.refreshToken = session.refreshToken;
      }

      return request<SessionResponse>("sessions/refresh", {
         body: JSON.stringify(payload),
      });
   },

   logout(): Promise<{ success: boolean; message?: string }> {
      const session = sessionManager.getSession();
      const payload: Record<string, any> = {
         clientType: "web",
      };

      if (session.refreshToken) {
         payload.refreshToken = session.refreshToken;
      }

      return request<{ success: boolean; message?: string }>(
         "sessions/logout",
         {
            body: JSON.stringify(payload),
         }
      );
   },
};
