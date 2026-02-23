/**
 * Task type definitions
 * Matches task-connect-relay backend Task model
 */

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  budget: number | { amount: number; currency: string; negotiable: boolean };
  budgetType: 'fixed' | 'hourly' | 'negotiable';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    city: string;
    state: string;
    pinCode?: string;
    country: string;
  };
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'started' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high';
  requesterId: string;
  creatorUid?: string; // Firebase UID of task creator
  requesterUid?: string; // Firebase UID of requester (for badge fetching)
  requesterName: string;
  requesterBadge?: 'none' | 'basic' | 'verified' | 'trusted' | 'elite'; // Poster's verification badge
  requesterVerificationTier?: number; // Poster's verification tier (0-3)
  assignedTo?: string;
  assigneeUid?: string;
  assignedToName?: string;
  assignedAt?: Date;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
  scheduledDate?: Date;
  scheduledTime?: string;
  flexibility: 'strict' | 'flexible' | 'anytime';
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    startDate?: Date;
    endDate?: Date;
    requireApproval?: boolean;
    minCommitment?: number;
  };
  schedule?: Array<{
    date: Date;
    status: 'open' | 'reserved' | 'assigned' | 'completed' | 'cancelled';
    assigneeId?: string | null;
    assigneeUid?: string | null;
  }>;
  requirements?: string[];
  attachments?: Array<{
    type: string;
    url: string;
    filename: string;
    uploadedAt: Date;
  }>;
  tags?: string[];
  isUrgent: boolean;
  isFeatured: boolean;
  views: number;
  applications: number;
  rating: number;
  review?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  completionProof?: Array<{
    url: string;
    filename: string;
    uploadedAt: Date;
    uploadedBy: string;
  }>;
  completionStatus?: 'pending_approval' | 'approved' | 'rejected';
  completionNotes?: string;
  completionRejectedReason?: string;
  completionApprovedAt?: Date;
  completionRejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

