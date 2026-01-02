/**
 * Task Application type definitions
 * Matches task-connect-relay backend TaskApplication model
 */

import { Task } from './task';

export interface TaskApplication {
  _id: string;
  id: string;
  
  // Task and applicant relationship
  taskId: string | Task;
  applicantId: string; // MongoDB ObjectId as string
  applicantProfile?: {
    name: string;
    rating?: number;
    photoURL?: string | null;
    totalReviews?: number;
    skills?: {
      list: string[];
    };
  };
  
  // Application details
  proposedBudget: {
    amount: number;
    currency: string;
    isNegotiable: boolean;
  };
  
  proposedTime: {
    startDate?: Date;
    endDate?: Date;
    estimatedDuration?: number; // in hours
    flexible: boolean;
  };
  
  // Application content
  coverLetter: string;
  relevantExperience: string[];
  portfolio: string[]; // URLs to portfolio items
  
  // Application status
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  
  // Communication
  messages: ApplicationMessage[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
  
  // Metadata
  isUrgent: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface ApplicationMessage {
  senderUid: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface CreateApplicationRequest {
  taskId: string;
  proposedBudget: {
    amount: number;
    currency?: string;
    isNegotiable?: boolean;
  };
  proposedTime?: {
    startDate?: Date;
    endDate?: Date;
    estimatedDuration?: number;
    flexible?: boolean;
  };
  coverLetter?: string;
  relevantExperience?: string[];
  portfolio?: string[];
}

export interface UpdateApplicationRequest {
  status: 'accepted' | 'rejected';
  message?: string;
}

export interface ApplicationsResponse {
  applications: TaskApplication[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

