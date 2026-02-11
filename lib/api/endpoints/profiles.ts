/**
 * Profiles API endpoints
 * Matches task-connect-relay routes/profiles.js
 */

import { fetchWithAuth, fetchPublic } from '../client';
import { UserProfile } from '@/types/user';

export const profilesApi = {
  /**
   * Get current user's profile
   * GET /api/v1/profiles/me
   */
  async me(): Promise<UserProfile> {
    const raw = await fetchWithAuth('profiles/me');

    // Normalise PAN verification field from backend (isPANVerified) to frontend type (isPanVerified)
    const normalised: UserProfile = {
      ...raw,
      // Prefer explicit isPanVerified if present, otherwise map from isPANVerified, defaulting to false
      isPanVerified:
        typeof raw.isPanVerified === 'boolean'
          ? raw.isPanVerified
          : typeof raw.isPANVerified === 'boolean'
          ? raw.isPANVerified
          : false,
    };

    return normalised;
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
   * Get profile by user ID (requires authentication)
   * GET /api/v1/profiles/:userId
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await fetchWithAuth(`profiles/${userId}`);
    return response.profile || response;
  },

  /**
   * Get public profile by user ID (no authentication required)
   * GET /api/v1/profiles/:userId
   */
  async getPublicProfile(userId: string): Promise<UserProfile> {
    const response = await fetchPublic(`profiles/${userId}`);
    return response.profile || response;
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
};

