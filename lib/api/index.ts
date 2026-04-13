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
import { fetchWithAuth } from "./client";

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
         const data = await fetchWithAuth("uploads/profile-picture", {
            method: "POST",
            body: formData,
         });

         if (data?.success && data?.data?.url) {
            return data.data.url;
         }
         if (data?.url) {
            return data.url;
         }

         throw new Error(data?.message || "Failed to upload image");
      } catch (error) {
         console.error("Image upload error:", error);
         if (error instanceof Error) {
            throw error;
         }
         throw new Error("Failed to upload image");
      }
   },

   async uploadTaskImage(file: File, taskId?: string): Promise<string> {
      // Upload generic images without mutating profile photoURL.
      const formData = new FormData();
      formData.append("image", file);
      if (taskId) {
         formData.append("taskId", taskId);
      }

      try {
         const data = await fetchWithAuth("uploads/task-image", {
            method: "POST",
            body: formData,
         });

         if (data?.success && data?.data?.url) {
            return data.data.url;
         }
         if (data?.url) {
            return data.url;
         }

         throw new Error(data?.message || "Failed to upload image");
      } catch (error) {
         console.error("Task image upload error:", error);
         if (error instanceof Error) {
            throw error;
         }
         throw new Error("Failed to upload image");
      }
   },

   async uploadCertificateImage(file: File): Promise<string> {
      // Upload certificate images through dedicated endpoint.
      const formData = new FormData();
      formData.append("image", file);

      try {
         const data = await fetchWithAuth("uploads/certificate", {
            method: "POST",
            body: formData,
         });

         if (data?.success && data?.data?.url) {
            return data.data.url;
         }
         if (data?.url) {
            return data.url;
         }

         throw new Error(data?.message || "Failed to upload certificate image");
      } catch (error) {
         console.error("Certificate image upload error:", error);
         if (error instanceof Error) {
            throw error;
         }
         throw new Error("Failed to upload certificate image");
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
