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
   roles: ("tasker" | "requester" | "poster" | "both")[];
   userType: "individual" | "business";
   location?: {
      type: "Point";
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
      primaryCategory?:
         | "home_services"
         | "cleaning"
         | "delivery"
         | "beauty"
         | "tech"
         | "tutoring"
         | "other";
      list?: Array<{
         name: string;
         category?: string;
         level?: "beginner" | "intermediate" | "expert";
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

   // Verification statuses
   isAadhaarVerified: boolean;
   aadhaarVerifiedAt?: Date;
   maskedAadhaar?: string; // Format: XXXX XXXX 1234

   isEmailVerified: boolean;
   emailVerifiedAt?: Date;

   isBankVerified: boolean;
   bankVerifiedAt?: Date;
   bankAccount?: {
      bankName?: string;
      maskedAccountNumber?: string; // Format: XXXX1234
      ifscCode?: string;
      accountHolderName?: string;
   };

   // PAN verification (required for business accounts)
   isPanVerified: boolean;
   panVerifiedAt?: Date;
   maskedPan?: string; // Format: XXXXX1234X

   // Phone verification
   isPhoneVerified: boolean;
   phoneVerifiedAt?: Date;

   isActive: boolean;
   onboardingStatus?: {
      isCompleted: boolean;
      completedSteps: {
         location: boolean;
         roles: boolean;
         profile: boolean;
      };
      lastStep?: "location" | "roles" | "profile";
   };
   verificationTier?: number; // 0=none, 1=basic, 2=verified, 3=trusted
   verificationBadge?: "none" | "basic" | "verified" | "trusted";
   lastVerifiedAt?: Date;
   reVerificationDueAt?: Date;
   verificationRestrictions?: {
      canPostTasks: boolean;
      canAcceptTasks: boolean;
      canReceivePayments: boolean;
      maxTaskValue?: number;
   };
   business?: {
      name?: string;
      registrationNumber?: string;
      taxId?: string;
      address?: string;
      website?: string;
      description?: string;
   };
   photoURL?: string;
   agreeUpdates?: boolean;
   agreeTerms?: boolean;
   createdAt: Date;
   updatedAt: Date;
   bio?: string;
}

export interface OnboardingState {
   step: "location" | "roles" | "complete";
   locationData?: {
      method: "search" | "input" | "gps";
      location?: any;
   };
   roleData?: {
      selectedRoles: string[];
   };
   lastUpdated: number;
}
