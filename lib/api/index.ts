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
   async uploadImage(_file: File): Promise<string> {
      // TODO: Implement image upload to cloud storage
      // For now, return a placeholder URL
      return `https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Uploaded+Image`;
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
