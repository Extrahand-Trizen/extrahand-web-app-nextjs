/**
 * API request and response type definitions
 * Matches task-connect-relay backend API response formats
 */

import type { UserProfile } from "./user";

export interface ApiError {
   success: false;
   error: string;
   message?: string;
   status?: number;
}

export interface ApiSuccess<T = any> {
   success: true;
   data?: T;
   message?: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

export interface SessionTokens {
   accessToken: string;
   accessTokenExpiresAt: string;
   sessionId: string;
   refreshToken?: string;
   refreshTokenExpiresAt?: string;
}

export interface SessionResponse {
   success: boolean;
   tokens: SessionTokens;
   message?: string;
}

export interface CompleteOTPResponse {
   success: boolean;
   profile?: UserProfile;
   user?: {
      uid: string;
      phone: string | null;
   };
   tokens: SessionTokens;
   error?: string;
}

export interface PaginationParams {
   page?: number;
   limit?: number;
   skip?: number;
}

export interface PaginationResponse {
   page: number;
   limit: number;
   total: number;
   pages: number;
}

export interface TaskQueryParams extends PaginationParams {
   category?: string;
   city?: string;
   minBudget?: number;
   maxBudget?: number;
   skills?: string[];
   sortBy?: string;
   status?: string;
   creatorUid?: string;
   assignedTo?: string;
}

export interface ApplicationQueryParams extends PaginationParams {
   taskId?: string;
   applicantUid?: string;
   status?: "pending" | "accepted" | "rejected" | "withdrawn";
   mine?: "true" | "false";
}
