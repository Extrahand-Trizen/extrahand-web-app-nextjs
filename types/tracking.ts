/**
 * Task Tracking type definitions
 * Types for task tracking, proof of work, activities, and reports
 */

import { Task } from "./task";

export type UserRole = "poster" | "tasker" | "viewer";

export interface TaskActivity {
   _id: string;
   taskId: string;
   type:
      | "status_change"
      | "file_upload"
      | "review"
      | "message"
      | "report"
      | "assignment";
   userId: string;
   userName: string;
   userAvatar?: string;
   description: string;
   metadata?: {
      oldStatus?: string;
      newStatus?: string;
      fileName?: string;
      fileUrl?: string;
      rating?: number;
      message?: string;
   };
   createdAt: Date;
}

export interface ProofOfWork {
   _id: string;
   taskId: string;
   uploadedBy: string;
   uploadedByName: string;
   uploadedByAvatar?: string;
   files: Array<{
      url: string;
      filename: string;
      type: string;
      size: number;
      thumbnailUrl?: string;
   }>;
   caption?: string;
   uploadedAt: Date;
}

export interface TaskReport {
   _id: string;
   taskId: string;
   generatedBy: string;
   reportType: "completion" | "summary" | "detailed";
   data: {
      timeline: TaskActivity[];
      proofs: ProofOfWork[];
      reviews?: any[];
      financial: {
         budget: number;
         paid: boolean;
         paymentDate?: Date;
      };
   };
   generatedAt: Date;
   downloadUrl?: string;
}

export interface StatusUpdate {
   taskId: string;
   newStatus: Task["status"];
   reason?: string;
   notes?: string;
}

export interface ProofUpload {
   taskId: string;
   files: File[];
   caption?: string;
}
