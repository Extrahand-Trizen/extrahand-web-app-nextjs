/**
 * User/Profile type definitions
 * Matches task-connect-relay backend Profile model
 */

export interface UserProfile {
  _id: string;
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  roles: ('tasker' | 'requester' | 'poster' | 'both')[];
  userType: 'individual' | 'business';
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    doorNo?: string;
    area?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
  };
  skills?: {
    primaryCategory?: 'home_services' | 'cleaning' | 'delivery' | 'beauty' | 'tech' | 'tutoring' | 'other';
    list?: Array<{
      name: string;
      category?: string;
      level?: 'beginner' | 'intermediate' | 'expert';
      yearsOfExperience?: number;
      certified?: boolean;
      certificates?: Array<{
        title: string;
        issuedBy: string;
        issuedDate: Date;
        documentUrl: string;
      }>;
      verified?: boolean;
    }>;
    updatedAt?: Date;
  };
  rating: number;
  totalReviews: number;
  totalTasks: number;
  completedTasks: number;
  isVerified: boolean;
  isAadhaarVerified: boolean;
  aadhaarVerifiedAt?: Date;
  isActive: boolean;
  onboardingStatus?: {
    isCompleted: boolean;
    completedSteps: {
      location: boolean;
      roles: boolean;
      profile: boolean;
    };
    lastStep?: 'location' | 'roles' | 'profile';
  };
  verificationTier?: number; // 0-3
  verificationBadge?: 'none' | 'basic' | 'verified' | 'trusted';
  lastVerifiedAt?: Date;
  reVerificationDueAt?: Date;
  verificationRestrictions?: {
    canPostTasks: boolean;
    canAcceptTasks: boolean;
    canReceivePayments: boolean;
    maxTaskValue?: number;
  };
  business?: {
    name: string;
    registrationNumber?: string;
    taxId?: string;
    address?: string;
    website?: string;
    description?: string;
  };
  agreeUpdates?: boolean;
  agreeTerms?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingState {
  step: 'location' | 'roles' | 'complete';
  locationData?: {
    method: 'search' | 'input' | 'gps';
    location?: any;
  };
  roleData?: {
    selectedRoles: string[];
  };
  lastUpdated: number;
}

