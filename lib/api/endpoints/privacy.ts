/**
 * Privacy API endpoints
 * Matches extrahand-user-service routes/privacy.ts
 */

import { fetchWithAuth } from '../client';

export interface ConsentSettings {
  marketing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  dataSharing: boolean;
}

export interface PrivacyDashboard {
  dataTracking: {
    totalTasks: number;
    totalMessages: number;
    totalReviews: number;
    storageUsed: string;
    lastExportDate?: Date;
  };
  consentHistory: Array<{
    type: string;
    value: boolean;
    updatedAt: Date;
    ipAddress: string;
  }>;
  accountStatus: {
    isActive: boolean;
    deletionScheduled: boolean;
    deletionDate?: Date;
  };
}

export interface DataExportResponse {
  profile: any;
  tasks: any[];
  messages: any[];
  reviews: any[];
  consents: any[];
  exportedAt: Date;
}

export const privacyApi = {
  /**
   * Get privacy dashboard with data tracking
   * GET /api/v1/privacy/dashboard
   */
  async getDashboard(): Promise<{ success: boolean; dashboard: PrivacyDashboard }> {
    return fetchWithAuth('privacy/dashboard');
  },

  /**
   * Export all user data (GDPR compliance)
   * GET /api/v1/privacy/data-export
   * Returns a downloadable JSON file
   */
  async exportData(): Promise<DataExportResponse> {
    return fetchWithAuth('privacy/data-export');
  },

  /**
   * Get current consent settings
   * GET /api/v1/privacy/consent
   */
  async getConsent(): Promise<{
    success: boolean;
    consent: {
      marketing: boolean;
      analytics: boolean;
      thirdParty: boolean;
      dataSharing: boolean;
      updatedAt: Date;
    };
  }> {
    return fetchWithAuth('privacy/consent');
  },

  /**
   * Update consent settings
   * POST /api/v1/privacy/consent
   */
  async updateConsent(
    consentType: 'marketing' | 'analytics' | 'thirdParty' | 'dataSharing',
    value: boolean,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
    consent: {
      type: string;
      value: boolean;
      updatedAt: Date;
    };
  }> {
    return fetchWithAuth('privacy/consent', {
      method: 'POST',
      body: JSON.stringify({ consentType, value, reason }),
    });
  },

  /**
   * Request account deletion
   * DELETE /api/v1/privacy/delete-account
   */
  async requestDeletion(
    confirm: boolean,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
    deletionScheduledFor: Date;
    gracePeriod: string;
    note: string;
  }> {
    return fetchWithAuth('privacy/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ confirm, reason }),
    });
  },

  /**
   * Cancel account deletion request
   * POST /api/v1/privacy/cancel-deletion
   */
  async cancelDeletion(): Promise<{
    success: boolean;
    message: string;
    accountStatus: string;
  }> {
    return fetchWithAuth('privacy/cancel-deletion', {
      method: 'POST',
    });
  },
};
