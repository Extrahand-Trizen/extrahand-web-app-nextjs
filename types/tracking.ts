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

export interface ReviewRatings {
   communication?: number;
   quality?: number;
   timeliness?: number;
   professionalism?: number;
   value?: number;
}

export interface Review {
   _id: string;
   taskId: string;
   reviewerUid: string;
   reviewedUid: string;
   reviewerName?: string;
   reviewerAvatar?: string;
   rating: number;
   title?: string;
   comment?: string;
   ratings?: ReviewRatings;
   isPublic: boolean;
   isVerified: boolean;
   helpful: number;
   notHelpful: number;
   response?: {
      comment: string;
      timestamp: Date;
   };
   createdAt: Date;
   updatedAt: Date;
}

export type ReportReason =
   | "spam"
   | "inappropriate_content"
   | "fraudulent"
   | "duplicate"
   | "wrong_category"
   | "other";

export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export interface TaskReportSubmission {
   _id?: string;
   userId: string;
   taskId: string;
   reason: ReportReason;
   description?: string;
   status?: ReportStatus;
   reviewedBy?: string;
   reviewedAt?: Date;
   resolutionNotes?: string;
   createdAt?: Date;
   updatedAt?: Date;
}
