/**
 * Verification gate for task posting and offer submission.
 * Ensures Aadhaar, PAN, and bank accounts are verified before allowing the action.
 */

import type { UserProfile } from "@/types/user";

export interface VerificationGateResult {
   allowed: boolean;
   missing: string[];
}

function isPanVerified(profile: UserProfile | null): boolean {
   if (!profile) return false;
   if (profile.userType === "business") {
      return !!profile.business?.pan?.isPANVerified;
   }
   return !!profile.isPanVerified;
}

/**
 * Check if the user has completed required verifications for posting a task
 * or submitting an offer: Aadhaar, Bank, and PAN (business requires PAN).
 */
export function getTaskPostingVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   const missing: string[] = [];
   if (!profile) {
      return { allowed: false, missing: ["Aadhaar", "Bank", "PAN"] };
   }
   if (!profile.isAadhaarVerified) missing.push("Aadhaar");
   if (!profile.isBankVerified) missing.push("Bank");
   if (!isPanVerified(profile)) missing.push("PAN");
   return {
      allowed: missing.length === 0,
      missing,
   };
}

/** Alias for offer submission – same requirements as posting. */
export function getOfferSubmissionVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   return getTaskPostingVerificationStatus(profile);
}
