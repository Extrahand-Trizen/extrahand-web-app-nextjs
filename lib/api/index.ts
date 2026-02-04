/**
 * Main API client export
 * Combines all endpoint modules
 */

import { profilesApi } from "./endpoints/profiles";
import { tasksApi } from "./endpoints/tasks";
import { applicationsApi } from "./endpoints/applications";
import { chatsApi } from "./endpoints/chats";
import { reviewsApi } from "./endpoints/reviews";
import { reportsApi } from "./endpoints/reports";
import { authApi } from "./endpoints/auth";
import { sessionsApi } from "./endpoints/sessions";
import { completionApi } from "./endpoints/completion";
import { privacyApi } from "./endpoints/privacy";
import { businessApi } from "./endpoints/business";
import { categoriesApi } from "./endpoints/categories";

export const api = {
   // Profile management
   ...profilesApi,

   // Task management
   ...tasksApi,

   // Application management
   ...applicationsApi,

   // Chat management
   ...chatsApi,

   // Review management
   ...reviewsApi,

   // Completion API (dynamic import)
   ...completionApi,

   // Report management
   ...reportsApi,

   // Auth management
   ...authApi,
   ...sessionsApi,

   // Privacy management
   ...privacyApi,

   // Business verification
   ...businessApi,

   // Categories from content-admin backend
   ...categoriesApi,

   // Utility functions
   async uploadImage(file: File): Promise<string> {
      // Upload profile picture through the API gateway
      const formData = new FormData();
      formData.append("image", file);
      
      try {
         const baseUrl = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}` : "";
         const url = baseUrl ? `${baseUrl}/api/v1/uploads/profile-picture` : `/api/v1/uploads/profile-picture`;

         const response = await fetch(url, {
            method: "POST",
            // Don't set Content-Type, let the browser set it with boundary
            body: formData,
            credentials: "include",
         });

         if (!response.ok) {
            let errorData: any = { message: `Upload failed with status ${response.status}` };
            
            // Try to parse as JSON, but handle non-JSON responses
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
               try {
                  errorData = await response.json();
               } catch (e) {
                  // If JSON parsing fails, use text
                  const text = await response.text();
                  errorData = { message: text || `Upload failed with status ${response.status}` };
               }
            } else {
               // Non-JSON response
               const text = await response.text();
               errorData = { message: text || `Upload failed with status ${response.status}` };
            }
            
            const errorMsg = errorData.message || errorData.error || `Upload failed with status ${response.status}`;
            throw new Error(errorMsg);
         }

         const data = await response.json();
         
         if (data.success && data.data?.url) {
            return data.data.url;
         } else if (data.url) {
            // Handle direct URL response format
            return data.url;
         } else {
            throw new Error(data.message || "Failed to upload image");
         }
      } catch (error) {
         console.error("Image upload error:", error);
         if (error instanceof Error) {
            throw error;
         }
         throw new Error("Failed to upload image");
      }
   },

   // User statistics
   async getUserStats() {
      const [myTasks, myApplications] = await Promise.all([
         tasksApi.getMyTasks(),
         applicationsApi.getMyApplications(),
      ]);

      const stats = {
         totalTasks: myTasks.tasks?.length || 0,
         openTasks:
            myTasks.tasks?.filter((t: any) => t.status === "open").length || 0,
         completedTasks:
            myTasks.tasks?.filter((t: any) => t.status === "completed")
               .length || 0,
         totalApplications: myApplications.applications?.length || 0,
         pendingApplications:
            myApplications.applications?.filter(
               (a: any) => a.status === "pending"
            ).length || 0,
         acceptedApplications:
            myApplications.applications?.filter(
               (a: any) => a.status === "accepted"
            ).length || 0,
      };

      return stats;
   },
};

// Re-export verification API
export { verificationApi } from './endpoints/verification';
