import { fetchWithAuth } from '../client';

export interface AadhaarVerificationInitiateResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    refId: string;
    maskedAadhaar: string;
    testOtp?: string; // Sandbox only
  };
}

export interface AadhaarVerificationVerifyResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    maskedAadhaar: string;
    verifiedData: {
      name: string;
      gender: string;
      yearOfBirth: string;
    };
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
    attemptsRemaining: number;
  };
}

export const verificationApi = {
  /**
   * Initiate Aadhaar verification (send OTP)
   * POST /api/v1/verification/aadhaar/initiate
   */
  async initiateAadhaar(
    aadhaarNumber: string,
    consent: { given: boolean; text?: string; version?: string }
  ): Promise<AadhaarVerificationInitiateResponse> {
    return fetchWithAuth('verification/aadhaar/initiate', {
      method: 'POST',
      body: JSON.stringify({
        aadhaarNumber,
        consentGiven: consent.given,
        consent,
      }),
    });
  },

  /**
   * Verify Aadhaar OTP
   * POST /api/v1/verification/aadhaar/verify
   */
  async verifyAadhaar(
    transactionId: string,
    otp: string
  ): Promise<AadhaarVerificationVerifyResponse> {
    return fetchWithAuth('verification/aadhaar/verify', {
      method: 'POST',
      body: JSON.stringify({
        transactionId,
        refId: transactionId,
        otp,
      }),
    });
  },

  /**
   * Resend Aadhaar OTP
   * POST /api/v1/verification/aadhaar/resend
   */
  async resendAadhaarOtp(refId: string): Promise<AadhaarVerificationInitiateResponse> {
    return fetchWithAuth('verification/aadhaar/resend', {
      method: 'POST',
      body: JSON.stringify({ refId }),
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
};
