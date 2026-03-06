/**
 * Verification gate for different actions in the platform
 * 
 * VERIFICATION FLOW:
 * Step 2: Posting/Applying - Phone + Email verification required
 * Step 3: Task Start - Aadhaar verification required (when tasker is selected)
 * Step 4: Task Completion - No additional verification
 * Step 5: Payment Withdrawal - PAN + Bank verification required
 */

import type { UserProfile } from "@/types/user";

export interface VerificationGateResult {
   allowed: boolean;
   missing: string[];
   message?: string;
}

function isPanVerified(profile: UserProfile | null): boolean {
   if (!profile) return false;
   if (profile.userType === "business") {
      return !!profile.business?.pan?.isPANVerified;
   }
   return !!profile.isPanVerified;
}

function isBankVerified(profile: UserProfile | null): boolean {
   if (!profile) return false;
   if (profile.userType === "business") {
      return !!profile.business?.bankAccount?.isVerified;
   }
   return !!profile.isBankVerified;
}

/**
 * STEP 2: Check if user can post a task
 * Requirements: Phone + Email verification only
 */
export function getTaskPostingVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   const missing: string[] = [];
   
   if (!profile) {
      return { 
         allowed: false, 
         missing: ["Phone", "Email"],
         message: "Please complete your profile to post tasks"
      };
   }

   if (!profile.isPhoneVerified) missing.push("Phone");
   if (!profile.isEmailVerified) missing.push("Email");

   return {
      allowed: missing.length === 0,
      missing,
      message: missing.length > 0 
         ? `Please verify your ${missing.join(" and ")} to post tasks` 
         : undefined
   };
}

/**
 * STEP 2: Check if user can apply/bid for tasks
 * Requirements: Phone + Email verification (same as posting)
 */
export function getOfferSubmissionVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   const missing: string[] = [];
   
   if (!profile) {
      return { 
         allowed: false, 
         missing: ["Phone", "Email"],
         message: "Please complete your profile to apply for tasks"
      };
   }

   if (!profile.isPhoneVerified) missing.push("Phone");
   if (!profile.isEmailVerified) missing.push("Email");

   return {
      allowed: missing.length === 0,
      missing,
      message: missing.length > 0 
         ? `Please verify your ${missing.join(" and ")} to apply for tasks` 
         : undefined
   };
}

/**
 * STEP 3: Check if tasker can start a task (after being selected)
 * Requirements: Aadhaar or Government ID verification
 */
export function getTaskStartVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   const missing: string[] = [];
   
   if (!profile) {
      return { 
         allowed: false, 
         missing: ["Aadhaar"],
         message: "Identity verification required"
      };
   }

   if (!profile.isAadhaarVerified) missing.push("Aadhaar");

   return {
      allowed: missing.length === 0,
      missing,
      message: missing.length > 0 
         ? "Aadhaar verification required before starting the task" 
         : undefined
   };
}

/**
 * STEP 5: Check if user can withdraw payments
 * Requirements: PAN + Bank verification
 */
export function getPaymentWithdrawalVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   const missing: string[] = [];
   
   if (!profile) {
      return { 
         allowed: false, 
         missing: ["PAN", "Bank Account"],
         message: "Verification required for withdrawals"
      };
   }

   const panVerified = isPanVerified(profile);
   const bankVerified = isBankVerified(profile);

   if (!panVerified) missing.push("PAN");
   if (!bankVerified) missing.push("Bank Account");

   return {
      allowed: missing.length === 0,
      missing,
      message: missing.length > 0 
         ? `Please verify your ${missing.join(" and ")} to withdraw payments` 
         : undefined
   };
}

/**
 * Get overall verification status summary
 */
export function getVerificationSummary(profile: UserProfile | null) {
   return {
      canPostTasks: getTaskPostingVerificationStatus(profile).allowed,
      canApplyForTasks: getOfferSubmissionVerificationStatus(profile).allowed,
      canStartTasks: getTaskStartVerificationStatus(profile).allowed,
      canWithdrawPayments: getPaymentWithdrawalVerificationStatus(profile).allowed,
      verifications: {
         phone: profile?.isPhoneVerified || false,
         email: profile?.isEmailVerified || false,
         aadhaar: profile?.isAadhaarVerified || false,
         pan: isPanVerified(profile),
         bank: isBankVerified(profile),
      }
   };
}
