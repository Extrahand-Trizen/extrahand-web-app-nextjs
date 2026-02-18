/**
 * Badge System Types
 */

export type BadgeLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Elite';

export interface BadgeThreshold {
  level: BadgeLevel;
  minReputation: number;
  minCompletedTasks: number;
  minRating: number;
  platformFeePercentage: number;
  maxCreditsPerDay: number;
  color: string;
  icon: string;
}

export interface BadgeInfo {
  _id: string;
  uid: string;
  currentBadge: BadgeLevel;
  reputation: number;
  completedTasks: number;
  rating: number;
  history: BadgeHistory[];
  upgradedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface BadgeHistory {
  badge: BadgeLevel;
  upgradedAt: number;
  requirements: {
    reputation: number;
    completedTasks: number;
    rating: number;
  };
}

export interface BadgeProgressData {
  currentBadge: BadgeLevel;
  nextBadge: BadgeLevel | null;
  currentReputation: number;
  nextRepThreshold: number;
  reputationProgress: number;
  completedTasks: number;
  tasksNeeded: number;
  taskProgress: number;
  currentRating: number;
  ratingNeeded: number;
  ratingProgress: number;
  platformFeePercentage: number;
  history: BadgeHistory[];
  reputationBreakdown?: {
    verifications: number;
    performance: number;
    reviews: number;
    reliability: number;
    total: number;
  };
  badgeRequirements?: Record<string, {
    minReputation: number;
    minTasks: number;
    minRating: number;
    minReviews: number;
    responseTime?: string;
    completionRate?: number;
    description: string;
  }>;
  verifications?: {
    count: number;
    breakdown?: Record<string, {
      status: 'pending' | 'verified' | 'rejected' | 'expired';
      points: number;
    }>;
    list?: Array<{
      type: 'email' | 'phone' | 'aadhaar' | 'pan' | 'bank';
      status: 'pending' | 'verified' | 'rejected' | 'expired';
    }>;
  };
}

export interface BadgeDisplayProps {
  badge?: BadgeLevel;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export interface VerificationRecord {
  _id: string;
  uid: string;
  type: 'email' | 'phone' | 'aadhaar' | 'pan' | 'bank';
  status: 'pending' | 'verified' | 'failed';
  verifiedAt?: number;
  maskedValue?: string;
  createdAt: number;
  updatedAt: number;
}
