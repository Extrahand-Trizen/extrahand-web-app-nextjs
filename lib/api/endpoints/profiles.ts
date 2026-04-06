/**
 * Profiles API endpoints
 * Matches task-connect-relay routes/profiles.js
 */

import { fetchWithAuth, fetchPublic } from '../client';
import { UserProfile } from '@/types/user';

function normalizeProfile(raw: any): UserProfile {
  return {
    ...raw,
    // PAN: backend may return either isPanVerified or isPANVerified.
    isPanVerified:
      typeof raw?.isPanVerified === 'boolean'
        ? raw.isPanVerified
        : typeof raw?.isPANVerified === 'boolean'
        ? raw.isPANVerified
        : false,
    // Email: support legacy/public payload variants.
    isEmailVerified:
      typeof raw?.isEmailVerified === 'boolean'
        ? raw.isEmailVerified
        : typeof raw?.emailVerified === 'boolean'
        ? raw.emailVerified
        : !!raw?.emailVerifiedAt,
    // Phone: support legacy/public payload variants.
    isPhoneVerified:
      typeof raw?.isPhoneVerified === 'boolean'
        ? raw.isPhoneVerified
        : typeof raw?.phoneVerified === 'boolean'
        ? raw.phoneVerified
        : !!raw?.phoneVerifiedAt || !!raw?.phone,
  };
}

export const profilesApi = {
  /**
   * Get current user's profile
   * GET /api/v1/profiles/me
   */
  async me(): Promise<UserProfile> {
    const raw = await fetchWithAuth('profiles/me');
    return normalizeProfile(raw);
  },

  /**
   * Create or update profile
   * POST /api/v1/profiles
   */
  async upsertProfile(body: Partial<UserProfile>): Promise<UserProfile> {
    return fetchWithAuth('profiles', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Update current user's profile
   * PUT /api/v1/profiles/me
   */
  async updateMyProfile(body: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetchWithAuth('profiles/me', {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return response.profile || response;
  },

  /**
   * Get profile by user ID (requires authentication)
   * GET /api/v1/profiles/:userId
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await fetchWithAuth(`profiles/${userId}`);
    return normalizeProfile(response.profile || response);
  },

  /**
   * Get public profile by user ID (no authentication required)
   * GET /api/v1/profiles/:userId
   */
  async getPublicProfile(userId: string): Promise<UserProfile> {
    const response = await fetchPublic(`profiles/${userId}`);
    return normalizeProfile(response.profile || response);
  },

  /**
   * Get onboarding status
   * GET /api/v1/profiles/onboarding-status
   */
  async getOnboardingStatus(): Promise<{
    isCompleted: boolean;
    completedSteps: {
      location: boolean;
      roles: boolean;
      profile: boolean;
    };
    lastStep?: string;
  }> {
    return fetchWithAuth('profiles/onboarding-status');
  },

  /**
   * Search users
   * GET /api/v1/profiles/search?q=query&limit=10
   */
  async searchUsers(query: string, limit: number = 10): Promise<{
    success: boolean;
    users: Array<{
      uid: string;
      name: string;
      email?: string;
      phone?: string;
      roles: string[];
      userType: string;
      skills?: any;
      rating: number;
      totalReviews: number;
      isVerified: boolean;
      isAadhaarVerified: boolean;
      location?: any;
    }>;
  }> {
    const queryString = `?q=${encodeURIComponent(query)}&limit=${limit}`;
    return fetchWithAuth(`profiles/search${queryString}`);
  },

  /**
   * Get profile statistics (public access)
   * GET /api/v1/profiles/:userId/stats
   */
  async getProfileStats(userId: string): Promise<{
    success: boolean;
    data: {
      totalTasks: number;
      completedTasks: number;
      postedTasks: number;
      totalReviews: number;
      rating: number;
    };
  }> {
    return fetchPublic(`profiles/${userId}/stats`);
  },

  /**
   * Update category alerts
   * PUT /api/v1/profiles/me/category-alerts
   */
  async updateCategoryAlerts(categories: Array<{ slug: string; name: string }>): Promise<{
    success: boolean;
    data: {
      categories: Array<{ slug: string; name: string }>;
    };
  }> {
    return fetchWithAuth('profiles/me/category-alerts', {
      method: 'PUT',
      body: JSON.stringify({ categories }),
    });
  },

  /**
   * Get category alerts
   * GET /api/v1/profiles/me/category-alerts
   */
  async getCategoryAlerts(): Promise<{
    success: boolean;
    data: {
      categories: Array<{ slug: string; name: string }>;
    };
  }> {
    return fetchWithAuth('profiles/me/category-alerts');
  },

  /**
   * Update keyword alerts
   * PUT /api/v1/profiles/me/keyword-alerts
   */
  async updateKeywordAlerts(keywords: string[]): Promise<{
    success: boolean;
    data: {
      keywords: string[];
    };
  }> {
    return fetchWithAuth('profiles/me/keyword-alerts', {
      method: 'PUT',
      body: JSON.stringify({ keywords }),
    });
  },

  /**
   * Get keyword alerts
   * GET /api/v1/profiles/me/keyword-alerts
   */
  async getKeywordAlerts(): Promise<{
    success: boolean;
    data: {
      keywords: string[];
    };
  }> {
    return fetchWithAuth('profiles/me/keyword-alerts');
  }
};