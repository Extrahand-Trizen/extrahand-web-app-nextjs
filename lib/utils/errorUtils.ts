/**
 * Error Utility Functions
 * Standardized error message extraction from backend API responses
 * 
 * Backend error format:
 * {
 *   success: false,
 *   error: "Main error message",
 *   message?: "Alternative message",
 *   details?: "Technical details",
 *   context?: "API context",
 *   service?: "Service name"
 * }
 */

/**
 * Extract a user-friendly error message from an error object
 * Works with backend API errors, standard Error objects, and unknown types
 */
export function getErrorMessage(error: unknown): string {
   // Handle null/undefined
   if (!error) {
      return "An unexpected error occurred";
   }

   // Handle Error objects with data property (APIError from client.ts)
   if (error instanceof Error) {
      const apiError = error as Error & { data?: any; status?: number };
      
      // If we have backend data, extract from it
      if (apiError.data) {
         return extractMessageFromData(apiError.data);
      }
      
      // Clean up generic API error prefix if present
      const message = apiError.message.replace(/^API call failed:\s*/i, "");
      return message || "An unexpected error occurred";
   }

   // Handle plain objects (direct API response)
   if (typeof error === "object") {
      return extractMessageFromData(error);
   }

   // Handle strings
   if (typeof error === "string") {
      return error || "An unexpected error occurred";
   }

   return "An unexpected error occurred";
}

/**
 * Extract message from API response data object
 * 
 * Backend response format (nested from API Gateway):
 * {
 *   error: "Request failed with status code 400",
 *   data: {
 *     success: false,
 *     error: "Cannot apply to your own task"  <-- This is the real message!
 *   }
 * }
 */
function extractMessageFromData(data: any): string {
   if (!data || typeof data !== "object") {
      return "An unexpected error occurred";
   }

   // Debug: log the structure to help identify where the message is
   console.log("🔍 Extracting error from:", JSON.stringify(data, null, 2)?.substring(0, 500));

   // Priority 1: Check for nested error in data.data.error (API Gateway wraps service errors)
   if (data.data?.error && typeof data.data.error === "string") {
      // Skip stack traces
      if (!data.data.error.includes("\n    at ")) {
         console.log("✅ Found error at data.data.error:", data.data.error);
         return data.data.error;
      }
   }

   // Priority 2: Check for nested message in data.data.message
   if (data.data?.message && typeof data.data.message === "string") {
      console.log("✅ Found message at data.data.message:", data.data.message);
      return data.data.message;
   }

   // Priority 3: Check for error directly on data (but skip generic wrappers)
   if (data.error && typeof data.error === "string") {
      // Skip generic wrapper messages
      if (!data.error.includes("Request failed with status code") && 
          !data.error.includes("\n    at ")) {
         console.log("✅ Found error at data.error:", data.error);
         return data.error;
      }
   }
   
   // Priority 4: Check for message directly on data
   if (data.message && typeof data.message === "string") {
      console.log("✅ Found message at data.message:", data.message);
      return data.message;
   }
   
   // Priority 5: Check for details
   if (data.details && typeof data.details === "string") {
      console.log("✅ Found details:", data.details);
      return data.details;
   }

   // Last resort: return what we have
   console.log("⚠️ Could not find specific error, using fallback");
   return "An unexpected error occurred";
}

/**
 * Check if error is a network/connection error
 */
export function isNetworkError(error: unknown): boolean {
   if (!error) return false;

   const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
   
   return (
      message.includes("failed to fetch") ||
      message.includes("network") ||
      message.includes("econnrefused") ||
      message.includes("timeout") ||
      message.includes("connection")
   );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
   if (error instanceof Error) {
      const apiError = error as Error & { status?: number };
      if (apiError.status === 401 || apiError.status === 403) {
         return true;
      }
   }

   const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
   return (
      message.includes("unauthorized") ||
      message.includes("unauthenticated") ||
      message.includes("401")
   );
}

/**
 * Get a short error description suitable for toast notifications
 */
export function getShortErrorMessage(error: unknown, fallback = "Something went wrong"): string {
   const message = getErrorMessage(error);
   
   // Truncate very long messages for toasts
   if (message.length > 100) {
      return message.substring(0, 97) + "...";
   }
   
   return message || fallback;
}
