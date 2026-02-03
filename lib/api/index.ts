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
<<<<<<< Updated upstream
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/uploads/profile-picture`, {
         method: 'POST',
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('idToken') || ''}`,
         },
         body: formData,
      });

      if (!response.ok) {
         throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.data?.photoURL || data.data?.url || '';
=======
      // Upload profile picture through the API gateway
      const formData = new FormData();
      formData.append("image", file);
      
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/uploads/profile-picture`, {
            method: "POST",
            headers: {
               // Don't set Content-Type, let the browser set it with boundary
            },
            body: formData,
            credentials: "include",
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Upload failed with status ${response.status}`);
         }

         const data = await response.json();
         
         if (data.success && data.data?.url) {
            return data.data.url;
         } else {
            throw new Error(data.message || "Failed to upload image");
         }
      } catch (error) {
         console.error("Image upload error:", error);
         throw new Error(error instanceof Error ? error.message : "Failed to upload image");
      }
>>>>>>> Stashed changes
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
