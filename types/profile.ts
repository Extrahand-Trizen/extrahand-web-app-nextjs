/**
 * Profile & Account Types
 * Types for profile management, settings, and account features
 */

// Verification status types
export type VerificationStatus =
   | "not_started"
   | "pending"
   | "verified"
   | "failed"
   | "expired";

export interface VerificationItem {
   type: "phone" | "email" | "aadhaar" | "pan" | "bank" | "face";
   status: VerificationStatus;
   verifiedAt?: Date;
   expiresAt?: Date;
   lastAttempt?: Date;
   failureReason?: string;
}

// Skill types
export interface Skill {
   id: string;
   name: string;
   category?: string;
   level?: "beginner" | "intermediate" | "expert";
   yearsOfExperience?: number;
   verified?: boolean;
}

// Review types
export interface Review {
   id: string;
   taskId: string;
   taskTitle: string;
   reviewerId: string;
   reviewerName: string;
   reviewerPhoto?: string;
   rating: number;
   comment: string;
   createdAt: Date;
   role: "poster" | "tasker";
}

// Work history types
export interface WorkHistoryItem {
   id: string;
   taskId?: string;
   taskTitle: string;
   category: string;
   completedDate: Date;
   completedAt?: Date; // Backward compatibility
   earnings: number;
   amount?: number; // Backward compatibility
   rating?: number;
   role?: "poster" | "tasker";
}

// Public profile view
export interface PublicProfile {
   uid: string;
   name: string;
   photoURL?: string;
   bio?: string;
   rating: number;
   totalReviews: number;
   completedTasks: number;
   memberSince: Date;
   lastActive?: Date;
   verificationBadge: "none" | "basic" | "verified" | "trusted";
   skills: Skill[];
   serviceArea?: {
      city: string;
      state?: string;
   };
   availability?: {
      isAvailable: boolean;
      schedule?: string;
   };
   reviews: Review[];
   workHistory: WorkHistoryItem[];
}

// Payment method types
export interface PaymentMethod {
   id: string;
   type: "card" | "upi" | "bank" | "wallet";
   isDefault: boolean;
   // Card-specific
   cardBrand?: "visa" | "mastercard" | "rupay" | "amex";
   lastFour?: string;
   expiryMonth?: number;
   expiryYear?: number;
   cardHolderName?: string;
   // UPI-specific
   upiId?: string;
   // Bank-specific
   bankName?: string;
   accountNumber?: string; // Masked
   ifscCode?: string;
   accountHolderName?: string;
   // Wallet-specific
   walletProvider?: string;
   walletId?: string;
   createdAt: Date;
}

// Payout method for taskers
export interface PayoutMethod {
   id: string;
   type: "bank" | "upi" | "wallet";
   isDefault: boolean;
   isVerified: boolean;
   bankName?: string;
   accountNumber?: string; // Masked
   ifscCode?: string;
   accountHolderName?: string;
   upiId?: string;
   walletProvider?: string;
   createdAt: Date;
}

// Transaction history
export interface Transaction {
   id: string;
   type: "payment" | "payout" | "refund" | "fee";
   amount: number;
   currency: string;
   status: "pending" | "completed" | "failed" | "cancelled";
   description: string;
   taskId?: string;
   taskTitle?: string;
   paymentMethodId?: string;
   payoutMethodId?: string;
   createdAt: Date;
   completedAt?: Date;
}

// Address types
export type AddressType = "home" | "work" | "billing" | "other";

export interface SavedAddress {
   id: string;
   type: AddressType;
   label: string;
   name: string;
   addressLine1: string;
   addressLine2?: string;
   landmark?: string;
   city: string;
   state: string;
   pinCode: string;
   country: string;
   phone?: string;
   alternatePhone?: string;
   isDefault: boolean;
   isVerified?: boolean;
   coordinates?: {
      lat: number;
      lng: number;
   };
   createdAt: Date;
   updatedAt?: Date;
}

// Billing address (for backwards compatibility)
export interface BillingAddress {
   id: string;
   label: string;
   name: string;
   addressLine1: string;
   addressLine2?: string;
   city: string;
   state: string;
   pinCode: string;
   country: string;
   phone?: string;
   isDefault: boolean;
}

// Notification preferences
export interface NotificationPreferences {
   email: {
      taskUpdates: boolean;
      newMessages: boolean;
      marketing: boolean;
      accountAlerts: boolean;
      weeklyDigest: boolean;
      transactional?: boolean;
      taskReminders?: boolean;
      keywordTaskAlerts?: boolean;
      recommendedTaskAlerts?: boolean;
   };
   push: {
      taskUpdates: boolean;
      newMessages: boolean;
      marketing: boolean;
      accountAlerts: boolean;
      transactional?: boolean;
      taskReminders?: boolean;
      keywordTaskAlerts?: boolean;
      recommendedTaskAlerts?: boolean;
   };
   inApp: {
      taskUpdates: boolean;
      newMessages: boolean;
      systemAlerts: boolean;
   };
   sms: {
      taskUpdates: boolean;
      accountAlerts: boolean;
      transactional?: boolean;
      taskReminders?: boolean;
   };
}

// User preferences
export interface UserPreferences {
   preferredCategories: string[];
   availability: {
      monday?: { start: string; end: string }[];
      tuesday?: { start: string; end: string }[];
      wednesday?: { start: string; end: string }[];
      thursday?: { start: string; end: string }[];
      friday?: { start: string; end: string }[];
      saturday?: { start: string; end: string }[];
      sunday?: { start: string; end: string }[];
   };
   serviceRadius: number; // in km
   language: string;
   currency: string;
   timezone: string;
}

// Security settings
export interface SecuritySettings {
   passwordLastChanged?: Date;
   twoFactorEnabled: boolean;
   twoFactorMethod?: "sms" | "email" | "authenticator";
   activeSessions: SessionInfo[];
   loginHistory: LoginAttempt[];
}

export interface SessionInfo {
   id: string;
   device: string;
   browser: string;
   location?: string;
   ipAddress: string;
   lastActive: Date;
   isCurrent: boolean;
}

export interface LoginAttempt {
   id: string;
   timestamp: Date;
   device: string;
   location?: string;
   ipAddress: string;
   success: boolean;
}

// Privacy settings
export interface PrivacySettings {
   showLastActive: boolean;
   showLocation: boolean;
   showRating: boolean;
   showCompletedTasks: boolean;
   allowMessagesFromAll: boolean;
   showOnSearch: boolean;
}

// Profile section navigation
export type ProfileSection =
   | "overview"
   | "public-profile"
   | "edit-profile"
   | "preferences"
   | "verifications"
   | "payments"
   | "addresses"
   | "notifications"
   | "security"
   | "privacy";


export interface ProfileNavItem {
   id: ProfileSection;
   label: string;
   icon: string;
   description?: string;
}

// Form states
export interface ProfileFormState {
   isLoading: boolean;
   isSaving: boolean;
   hasChanges: boolean;
   errors: Record<string, string>;
   lastSaved?: Date;
}
