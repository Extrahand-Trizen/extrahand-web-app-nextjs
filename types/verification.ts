/**
 * Verification Types
 * Types for identity verification flows in the profile section
 */

// Verification type identifiers
export type VerificationType =
   | "aadhaar"
   | "pan"
   | "bank_account"
   | "driving_license"
   | "face_match"
   | "liveness"
   | "face_aadhaar"
   | "email";

// Verification status states
export type VerificationStatusType =
   | "not_started"
   | "pending"
   | "otp_sent"
   | "otp_verified"
   | "verified"
   | "failed"
   | "expired";

// Provider types
export type VerificationProvider = "cashfree" | "signzy" | "karza" | "mock";

// Verification record from backend
export interface VerificationRecord {
   _id: string;
   userId: string;
   type: VerificationType;
   status: VerificationStatusType;
   provider: VerificationProvider;
   transactionId?: string;
   refId?: string;

   // Aadhaar specific
   maskedAadhaar?: string; // Format: XXXX XXXX 1234

   // Bank specific
   maskedBankAccount?: string; // Format: XXXX1234

   // Verified data (masked/minimal)
   verifiedData?: {
      name?: string;
      yearOfBirth?: string;
      gender?: string;
      address?: {
         line1?: string;
         line2?: string;
         city?: string;
         state?: string;
         pincode?: string;
      };
   };

   // OTP state
   otpSent?: boolean;
   otpSentAt?: Date;
   otpExpiresAt?: Date;
   otpVerified?: boolean;
   otpAttempts?: number;

   // Consent
   consent?: {
      given: boolean;
      givenAt?: Date;
      consentVersion?: string;
   };

   // Timestamps
   initiatedAt?: Date;
   verifiedAt?: Date;
   failedAt?: Date;
   failureReason?: string;
   createdAt: Date;
   updatedAt: Date;
}

// User verification status summary
export interface UserVerificationStatus {
   isAadhaarVerified: boolean;
   isPANVerified: boolean;
   isBankVerified: boolean;
   isFaceVerified: boolean;
   isLivenessVerified: boolean;
   isEmailVerified: boolean;
   verificationTier: 0 | 1 | 2 | 3; // 0=none, 1=basic, 2=verified, 3=trusted
   verifications: Array<{
      type: VerificationType;
      verifiedAt?: Date;
      provider?: VerificationProvider;
   }>;
}

// Verification item for UI display
export interface VerificationDisplayItem {
   id: string;
   type: VerificationType;
   title: string;
   description: string;
   status: VerificationStatusType;
   icon: string; // Icon name for lookup
   verifiedAt?: Date;
   maskedValue?: string;
   route?: string; // Route for full-page verification
   isInline?: boolean; // For lightweight verifications like email
}

// Aadhaar verification form state (DigiLocker flow)
export interface AadhaarVerificationState {
   step: "consent" | "input" | "redirecting" | "success" | "error";
   mobileNumber: string;
   aadhaarNumber: string;
   consentGiven: boolean;
   verificationId?: string;
   digilockerUrl?: string;
   error?: string;
   verifiedData?: {
      name?: string;
      maskedAadhaar?: string;
   };
}

// Bank verification form state
export interface BankVerificationState {
   step: "consent" | "input" | "verifying" | "success" | "error";
   accountNumber: string;
   confirmAccountNumber: string;
   ifscCode: string;
   accountHolderName: string;
   consentGiven: boolean;
   error?: string;
   verifiedData?: {
      bankName?: string;
      maskedAccountNumber?: string;
      accountHolderName?: string;
   };
}

// Email verification state (inline)
export interface EmailVerificationState {
   step: "input" | "otp_sent" | "verified";
   email: string;
   otp: string;
   otpSentAt?: Date;
   error?: string;
}

// API request/response types
export interface InitiateAadhaarRequest {
   aadhaarNumber: string;
   consent: {
      given: boolean;
      ipAddress?: string;
      userAgent?: string;
   };
}

export interface InitiateAadhaarResponse {
   success: boolean;
   refId?: string;
   transactionId?: string;
   otpExpiresAt?: string;
   error?: string;
}

export interface VerifyAadhaarOTPRequest {
   refId: string;
   otp: string;
}

export interface VerifyAadhaarOTPResponse {
   success: boolean;
   verified?: boolean;
   maskedAadhaar?: string;
   verifiedData?: {
      name?: string;
   };
   error?: string;
}

export interface VerifyBankAccountRequest {
   accountNumber: string;
   ifscCode: string;
   accountHolderName: string;
   consent: {
      given: boolean;
      ipAddress?: string;
      userAgent?: string;
   };
}

export interface VerifyBankAccountResponse {
   success: boolean;
   verified?: boolean;
   bankName?: string;
   maskedAccountNumber?: string;
   verifiedAccountHolderName?: string;
   error?: string;
   mismatchReason?: string;
}

// Consent text for verifications (DigiLocker flow)
export const AADHAAR_CONSENT_TEXT = `I voluntarily provide my Aadhaar/mobile for verification purposes. I understand that:

• My Aadhaar details will be verified through DigiLocker (government-backed, secure)
• Only my name and masked Aadhaar number will be stored after verification
• This verification helps build trust within the ExtraHand community
• I can withdraw my consent at any time through my profile settings

By proceeding, I confirm that I am the holder of this Aadhaar number and authorize ExtraHand to verify my identity via DigiLocker.`;

export const BANK_CONSENT_TEXT = `I voluntarily provide my bank account details for verification purposes. I understand that:\n\n

• My bank account will be verified using penny drop verification\n
• Only my bank name and masked account number will be stored after verification\n
• This verification is required to receive payments for completed tasks\n
• My bank details are encrypted and stored securely\n

By proceeding, I confirm that I am the account holder and authorize ExtraHand to verify my bank account.`;

export const EMAIL_CONSENT_TEXT = `I confirm this email address belongs to me and I authorize ExtraHand to send verification and important account communications to this address.`;

// Structured consent objects (DigiLocker flow - government-backed, consent-based KYC)
export const AADHAAR_CONSENT = {
   points: [
      "My Aadhaar details will be verified through DigiLocker (government-backed, secure)",
      "Only my name and masked Aadhaar number will be stored after verification",
      "This verification helps build trust within the ExtraHand community",
      "I can withdraw my consent at any time through my profile settings",
   ],
   paragraph:
      "By proceeding, I confirm that I am the holder of this Aadhaar number and authorize ExtraHand to verify my identity via DigiLocker.",
};

export const BANK_CONSENT = {
   points: [
      "My bank account will be verified using penny drop verification",
      "Only my bank name and masked account number will be stored after verification",
      "This verification is required to receive payments for completed tasks",
      "My bank details are encrypted and stored securely",
   ],
   paragraph:
      "By proceeding, I confirm that I am the account holder and authorize ExtraHand to verify my bank account.",
};
