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
  applicantUid?: string;
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
  selectedDates?: Date[];
  
  // Application content
  coverLetter: string;
  relevantExperience: string[];
  portfolio: string[]; // URLs to portfolio items
  
  // Application status
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  negotiation?: {
    currentAmount: number;
    status: 'none' | 'countered_by_poster' | 'countered_by_tasker' | 'accepted' | 'rejected';
    lastActionBy?: 'poster' | 'tasker';
    history?: Array<{
      amount: number;
      action: 'counter' | 'accept' | 'reject';
      by: 'poster' | 'tasker';
      at: Date | string;
    }>;
  };
  
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
  selectedDates?: Date[];
  coverLetter?: string;
  relevantExperience?: string[];
  portfolio?: string[];
}

export interface UpdateApplicationRequest {
  status: 'accepted' | 'rejected';
  message?: string;
}

export interface EditApplicationRequest {
  coverLetter?: string;
  proposedBudget?: {
    amount?: number;
    currency?: string;
  };
}

export interface NegotiateApplicationRequest {
  action: 'counter' | 'accept' | 'reject';
  amount?: number;
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

