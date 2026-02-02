import { fetchWithAuth } from '../client';

// DigiLocker (Aadhaar) - replaces OTP flow
export interface DigilockerInitiateResponse {
  success: boolean;
  message: string;
  data: {
    verification_id: string;
    url: string;
    status: string;
    urlExpiresAt?: string;
    alreadyVerified?: boolean;
    maskedAadhaar?: string;
    verifiedAt?: string;
  };
}

export interface DigilockerStatusResponse {
  success: boolean;
  message: string;
  data: {
    verification_id: string;
    status: string;
    document_consent?: boolean;
    document_consent_validity?: string;
    user_details?: Record<string, string>;
    ready_for_complete: boolean;
  };
}

export interface DigilockerCompleteResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    maskedAadhaar?: string;
    verifiedAt?: string;
    alreadyVerified?: boolean;
  };
}

export interface AadhaarVerificationStatus {
  success: boolean;
  data: {
    status: string;
    isVerified: boolean;
    type: string;
    maskedAadhaar?: string;
    provider?: string;
    verifiedAt?: Date;
  };
}

export const verificationApi = {
  /**
   * Initiate DigiLocker Aadhaar verification
   * POST /api/v1/verification/aadhaar/digilocker/initiate
   * Returns DigiLocker URL for user to complete verification
   */
  async initiateDigilocker(params: {
    mobileNumber?: string;
    aadhaarNumber?: string;
    consentGiven: boolean;
  }): Promise<DigilockerInitiateResponse> {
    return fetchWithAuth('verification/aadhaar/digilocker/initiate', {
      method: 'POST',
      body: JSON.stringify({
        mobileNumber: params.mobileNumber,
        aadhaarNumber: params.aadhaarNumber,
        consentGiven: params.consentGiven,
      }),
    });
  },

  /**
   * Get DigiLocker verification status (for polling)
   * GET /api/v1/verification/aadhaar/digilocker/status?verification_id=xxx
   */
  async getDigilockerStatus(verificationId: string): Promise<DigilockerStatusResponse> {
    return fetchWithAuth(
      `verification/aadhaar/digilocker/status?verification_id=${encodeURIComponent(verificationId)}`
    );
  },

  /**
   * Complete DigiLocker verification (fetch document, update profile)
   * POST /api/v1/verification/aadhaar/digilocker/complete
   */
  async completeDigilocker(verificationId: string): Promise<DigilockerCompleteResponse> {
    return fetchWithAuth('verification/aadhaar/digilocker/complete', {
      method: 'POST',
      body: JSON.stringify({ verification_id: verificationId }),
    });
  },

  /**
   * Get verification status for a user
   * GET /api/v1/verification/status/:userId
   */
  async getStatus(userId: string): Promise<AadhaarVerificationStatus> {
    return fetchWithAuth(`verification/status/${userId}`);
  },

  /**
   * Get verification status for current user (uses auth context)
   * GET /api/v1/verification/status/me
   */
  async getMyStatus(): Promise<{
    success: boolean;
    data: {
      aadhaar?: {
        status: string;
        isVerified: boolean;
        maskedAadhaar?: string;
        verifiedAt?: Date;
      };
      pan?: {
        status: string;
        isVerified: boolean;
        maskedPan?: string;
        verifiedAt?: Date;
      };
      bank?: {
        status: string;
        isVerified: boolean;
        maskedBankAccount?: string;
        verifiedAt?: Date;
      };
    };
  }> {
    return fetchWithAuth('verification/status/me');
  },

  /**
   * Verify bank account with penny drop
   * POST /api/v1/verification/bank/verify
   */
  async verifyBankAccount(
    accountNumber: string,
    ifsc: string,
    accountHolderName: string,
    consent: { given: boolean; text?: string; version?: string }
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      maskedBankAccount: string;
      accountHolderName: string;
      bankName: string;
      ifsc: string;
      status: string;
    };
  }> {
    return fetchWithAuth('verification/bank/verify', {
      method: 'POST',
      body: JSON.stringify({
        accountNumber,
        ifsc,
        accountHolderName,
        consent,
      }),
    });
  },

  /**
   * Get verification features (what's enabled)
   * GET /api/v1/verification/features
   */
  async getFeatures(): Promise<{
    success: boolean;
    features: {
      AADHAAR: boolean;
      PAN: boolean;
      BANK: boolean;
      FACE: boolean;
      LIVENESS: boolean;
    };
  }> {
    return fetchWithAuth('verification/features');
  },

  // ============ Email Verification ============

  /**
   * Initiate email verification (send OTP)
   * POST /api/v1/verification/email/initiate
   */
  async initiateEmail(
    email: string,
    consentGiven: boolean = true
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      verificationId: string;
      maskedEmail: string;
      expiresAt: string;
      expiresInMinutes: number;
    };
  }> {
    return fetchWithAuth('verification/email/initiate', {
      method: 'POST',
      body: JSON.stringify({
        email,
        consentGiven,
      }),
    });
  },

  /**
   * Verify email OTP
   * POST /api/v1/verification/email/verify
   */
  async verifyEmail(
    otp: string,
    verificationId?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      status: string;
      maskedEmail: string;
      verifiedAt: string;
      alreadyVerified?: boolean;
    };
  }> {
    return fetchWithAuth('verification/email/verify', {
      method: 'POST',
      body: JSON.stringify({
        otp,
        verificationId,
      }),
    });
  },

  /**
   * Resend email verification OTP
   * POST /api/v1/verification/email/resend
   */
  async resendEmailOtp(): Promise<{
    success: boolean;
    message: string;
    data: {
      verificationId: string;
      maskedEmail: string;
      expiresAt: string;
      expiresInMinutes: number;
    };
  }> {
    return fetchWithAuth('verification/email/resend', {
      method: 'POST',
    });
  },

  /**
   * Get email verification status
   * GET /api/v1/verification/email/status/:userId
   */
  async getEmailStatus(userId: string): Promise<{
    success: boolean;
    data: {
      status: string;
      isVerified: boolean;
      maskedEmail?: string;
      verifiedAt?: string;
      attemptsRemaining: number;
    };
  }> {
    return fetchWithAuth(`verification/email/status/${userId}`);
  },
};
