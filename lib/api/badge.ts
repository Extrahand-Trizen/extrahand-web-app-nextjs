/**
 * Badge API endpoints
 */

import { createApiClient } from './base';
import type { BadgeInfo, BadgeProgressData, VerificationRecord } from '@/types/badge';

/**
 * Get user's badge information
 */
export async function getBadgeInfo(): Promise<BadgeInfo> {
  const api = createApiClient();
  const response = await api.get('/user/badge');
  return response.data.data;
}

/**
 * Get any user's badge information by UID (public endpoint)
 * Used for displaying badges on profiles, task listings, etc.
 */
export async function getUserBadge(uid: string): Promise<{ userId: string; uid: string; currentBadge: string; name: string; badgeUpgradedAt?: string }> {
  const api = createApiClient();
  const response = await api.get(`/user/badge/public/${uid}`);
  return response.data.data;
}

/**
 * Get badge progress details
 */
export async function getBadgeProgress(): Promise<BadgeProgressData> {
  const api = createApiClient();
  const response = await api.get('/user/badge/progress');
  return response.data.data;
}

/**
 * Get all badge information (levels, thresholds)
 */
export async function getAllBadgeInfo(): Promise<unknown> {
  const api = createApiClient();
  const response = await api.get('/user/badge/all-badges');
  return response.data;
}

/**
 * Check and upgrade badge if eligible
 */
export async function checkBadgeUpgrade(): Promise<{
  upgraded: boolean;
  previousBadge?: string;
  newBadge?: string;
  message: string;
}> {
  const api = createApiClient();
  const response = await api.post('/user/badge/check-upgrade');
  return response.data;
}

/**
 * Get platform fee percentage based on badge
 */
export async function getPlatformFee(): Promise<{
  feePercentage: number;
  badge: string;
  message: string;
}> {
  const api = createApiClient();
  const response = await api.get('/user/badge/platform-fee');
  return response.data;
}

/**
 * Get user's verification records
 */
export async function getVerificationRecords(): Promise<VerificationRecord[]> {
  const api = createApiClient();
  const response = await api.get('/user/badge/verifications');
  return response.data;
}

/**
 * Apply for Elite badge (requires admin approval)
 */
export async function applyForEliteBadge(
  coverLetter: string,
  documents: File[]
): Promise<{ success: boolean; applicationId: string; message: string }> {
  const formData = new FormData();
  formData.append('coverLetter', coverLetter);
  documents.forEach((doc, index) => {
    formData.append(`document_${index}`, doc);
  });

  const api = createApiClient();
  const response = await api.post('/user/badge/apply-elite', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Get Elite badge application status
 */
export async function getEliteBadgeStatus(): Promise<{
  status: 'not_applied' | 'pending' | 'approved' | 'rejected';
  reason?: string;
  rejectionReason?: string;
  appliedAt?: number;
  reviewedAt?: number;
}> {
  const api = createApiClient();
  const response = await api.get('/user/badge/elite-status');
  return response.data;
}

/**
 * Get badge comparison
 */
export async function getBadgeComparison(): Promise<unknown> {
  const api = createApiClient();
  const response = await api.get('/user/badge/comparison');
  return response.data;
}

/**
 * Badge color map
 */
export const BADGE_COLORS = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Elite: '#9D4EDD',
};

/**
 * Badge emoji map
 */
export const BADGE_EMOJIS = {
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Elite: '👑',
};

/**
 * Get badge level from reputation
 */
export function getBadgeLevelFromReputation(reputation: number): string {
  if (reputation >= 1000) return 'Platinum';
  if (reputation >= 500) return 'Gold';
  if (reputation >= 250) return 'Silver';
  return 'Bronze';
}

/**
 * Calculate badge progress percentage
 */
export function calculateBadgeProgress(current: number, target: number): number {
  if (target === 0) return 100;
  const progress = (current / target) * 100;
  return Math.min(progress, 100);
}
