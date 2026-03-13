import { fetchWithAuth } from '../client';
import { getApiBaseUrl } from '@/lib/config';

export interface BusinessDetails {
  name?: string;
  registrationNumber?: string;
  taxId?: string;
  address?: string;
  website?: string;
  description?: string;
}

// Matches backend response from BusinessService.getBusinessStatus
export interface BusinessStatus {
  success: boolean;
  business: {
    details: BusinessDetails;
    pan: {
      number?: string;
      isPANVerified: boolean;
      panVerifiedAt?: Date;
      panVerificationRef?: string;
    };
    bankAccount: {
      accountNumber?: string;
      ifscCode?: string;
      accountHolderName?: string;
      bankName?: string;
      isVerified: boolean;
      verifiedAt?: Date;
      bankVerificationRef?: string;
    };
    isGSTVerified: boolean;
    gstNumber?: string;
    gstVerificationRef?: string;
    gstVerifiedAt?: Date;
    verificationStatus: {
      level: number; // 0: none, 1: PAN+Bank, 2: +GST+Aadhaar, 3: +Documents
      badge?: "none" | "verified" | "trusted" | "enterprise";
      lastVerifiedAt?: Date;
    };
  };
}

export interface ConsentData {
  given: boolean;
  text?: string;
  version?: string;
}

export const businessApi = {
  /**
   * Save business details
   * POST /api/v1/business/details
   */
  async saveDetails(businessData: BusinessDetails): Promise<{
    success: boolean;
    message: string;
  }> {
    return fetchWithAuth('business/details', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  },

  /**
   * Get business verification status
   * GET /api/v1/business/status
   */
  async getStatus(): Promise<BusinessStatus> {
    return fetchWithAuth('business/status');
  },

  /**
   * Verify PAN number
   * POST /api/v1/business/pan/verify
   */
  async verifyPAN(
    panNumber: string,
    consent: ConsentData | boolean
  ): Promise<{
    success: boolean;
    verified: boolean;
    message: string;
    data?: {
      name: string;
      category: string;
      maskedPan: string;
    };
  }> {
    // Support both old boolean and new object format for backward compatibility
    const consentData: ConsentData = typeof consent === 'boolean' 
      ? { given: consent, text: "I consent to verify my PAN for business operations", version: "v1.0" }
      : consent;

    return fetchWithAuth('business/pan/verify', {
      method: 'POST',
      body: JSON.stringify({ panNumber, consent: consentData }),
    });
  },

  /**
   * Verify bank account
   * POST /api/v1/business/bank/verify
   */
  async verifyBank(
    accountNumber: string,
    ifscCode: string,
    accountHolderName: string,
    consent: ConsentData | boolean
  ): Promise<{
    success: boolean;
    verified: boolean;
    message: string;
    data?: {
      maskedAccountNumber: string;
      bankName: string;
    };
  }> {
    const consentData: ConsentData = typeof consent === 'boolean'
      ? { given: consent, text: "I consent to verify my bank account", version: "v1.0" }
      : consent;

    return fetchWithAuth('business/bank/verify', {
      method: 'POST',
      body: JSON.stringify({
        accountNumber,
        ifscCode,
        accountHolderName,
        consent: consentData,
      }),
    });
  },

  /**
   * Verify GST number
   * POST /api/v1/business/gst/verify
   */
  async verifyGST(
    gstNumber: string
  ): Promise<{
    success: boolean;
    verified: boolean;
    message: string;
    data?: {
      businessName: string;
      gstStatus: string;
    };
  }> {
    return fetchWithAuth('business/gst/verify', {
      method: 'POST',
      body: JSON.stringify({ gstNumber }),
    });
  },

  /**
   * Upload business document
   * POST /api/v1/business/documents/upload
   */
  async uploadDocument(
    documentType: string,
    file: File
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      documentId: string;
      documentUrl: string;
    };
  }> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const apiBase = getApiBaseUrl().replace(/\/$/, '');
    return fetch(`${apiBase}/api/v1/business/documents/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then(res => res.json());
  },
};
