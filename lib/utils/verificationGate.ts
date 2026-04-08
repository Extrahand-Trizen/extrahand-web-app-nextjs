/**
 * Verification gate for task posting and offer submission.
 * Currently:
 * - Task posting requires Aadhaar only for taskers (poster-only users can post without it).
 * - Offer submission keeps the full Aadhaar + Bank + PAN requirement.
 */

import type { UserProfile } from "@/types/user";

export interface VerificationGateResult {
   allowed: boolean;
   missing: string[];
}

function isTaskerRole(profile: UserProfile): boolean {
   const roles = Array.isArray(profile.roles) ? profile.roles : [];
   return roles.includes("tasker") || roles.includes("both");
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
 * Aadhaar is required only for taskers. Poster/requester-only users can post
 * without Aadhaar. PAN and Bank are optional for posting.
 */
export function getTaskPostingVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   const missing: string[] = [];
   if (!profile) {
      return { allowed: false, missing: ["Aadhaar"] };
   }

   // Aadhaar is optional for poster/requester-only users, required for taskers.
   if (isTaskerRole(profile) && !profile.isAadhaarVerified) {
      missing.push("Aadhaar");
   }

   return {
      allowed: missing.length === 0,
      missing,
   };
}

/**
 * Offer submission gate.
 * Now same as task posting: only Aadhaar is required (PAN and Bank optional).
 */
export function getOfferSubmissionVerificationStatus(
   profile: UserProfile | null
): VerificationGateResult {
   const missing: string[] = [];
   if (!profile) {
      return { allowed: false, missing: ["Aadhaar"] };
   }
   if (!profile.isAadhaarVerified) missing.push("Aadhaar");
   return {
      allowed: missing.length === 0,
      missing,
   };
}
