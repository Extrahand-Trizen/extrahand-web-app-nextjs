/**
 * Profiles API endpoints
 * Matches task-connect-relay routes/profiles.js
 */

import { fetchWithAuth } from '../client';
import { UserProfile } from '@/types/user';

export const profilesApi = {
  /**
   * Get current user's profile
   * GET /api/v1/profiles/me
   */
  async me(): Promise<UserProfile> {
    return fetchWithAuth('profiles/me');
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
   * Get profile by user ID
   * GET /api/v1/profiles/:userId
   */
  async getProfile(userId: string): Promise<UserProfile> {
    return fetchWithAuth(`profiles/${userId}`);
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
};

