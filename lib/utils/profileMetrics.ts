import { UserProfile } from '@/types/user';

export interface ProfileMetrics {
  completionRate: number;
  onTimeRate: number;
  avgResponseTime: string;
  repeatCustomerRate: number;
  categoryBreakdown?: Array<{
    category: string;
    tasksCompleted: number;
    avgRating: number;
  }>;
}

export interface Achievement {
  id: string;
  type: 'milestone' | 'quality' | 'speed' | 'loyalty' | 'category_expert';
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface AvailabilityInfo {
  isAvailable: boolean;
  status: 'available' | 'busy' | 'unavailable';
  serviceAreas: string[];
  responseTime: string;
  workingHours?: {
    [key: string]: { start: string; end: string };
  };
}

export interface EnhancedPublicProfile {
  user: UserProfile;
  metrics: ProfileMetrics;
  achievements: Achievement[];
  availability: AvailabilityInfo;
}

/**
 * Calculate profile metrics from user data
 */
export function calculateProfileMetrics(user: UserProfile): ProfileMetrics {
  const completionRate = user.totalTasks > 0
    ? Math.round((user.completedTasks / user.totalTasks) * 100)
    : 0; // Show 0% when no tasks

  // For now, use placeholder data - these would come from actual task queries
  const onTimeRate = user.completedTasks > 0 ? 95 : 0; // Show 0% when no completed tasks
  const avgResponseTime = user.completedTasks > 0 ? "< 2 hours" : "N/A"; // Only show if has tasks
  const repeatCustomerRate = 0; // Would calculate from task data

  return {
    completionRate,
    onTimeRate,
    avgResponseTime,
    repeatCustomerRate,
  };
}

/**
 * Generate achievements based on user milestones
 */
export function generateAchievements(user: UserProfile): Achievement[] {
  const achievements: Achievement[] = [];

  // Milestone achievements
  if (user.completedTasks >= 10) {
    achievements.push({
      id: 'milestone_10',
      type: 'milestone',
      title: '10 Tasks Completed',
      description: 'Completed your first 10 tasks successfully',
      icon: '🎯',
      earnedAt: new Date(), // Would be actual achievement date from DB
    });
  }

  if (user.completedTasks >= 50) {
    achievements.push({
      id: 'milestone_50',
      type: 'milestone',
      title: '50 Tasks Master',
      description: 'Reached 50 completed tasks milestone',
      icon: '⭐',
      earnedAt: new Date(),
    });
  }

  if (user.completedTasks >= 100) {
    achievements.push({
      id: 'milestone_100',
      type: 'milestone',
      title: 'Century Club',
      description: 'Completed 100 tasks - elite performer!',
      icon: '🏆',
      earnedAt: new Date(),
    });
  }

  // Quality achievements
  if (user.rating >= 4.5 && user.totalReviews >= 10) {
    achievements.push({
      id: 'quality_5star',
      type: 'quality',
      title: '5-Star Specialist',
      description: 'Maintained exceptional 4.5+ rating',
      icon: '⭐',
      earnedAt: new Date(),
    });
  }

  // Trust Level Achievement
  if (user.verificationBadge === 'trusted') {
    achievements.push({
      id: 'trust_verified',
      type: 'quality',
      title: 'Trusted Professional',
      description: 'Achieved highest verification level',
      icon: '🛡️',
      earnedAt: new Date(),
    });
  }

  // Loyalty achievement
  const memberForMonths = user.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;

  if (memberForMonths >= 12) {
    achievements.push({
      id: 'loyalty_1year',
      type: 'loyalty',
      title: '1 Year Member',
      description: 'Active member for over a year',
      icon: '🎂',
      earnedAt: new Date(),
    });
  }

  return achievements;
}

/**
 * Get availability information
 */
export function getAvailabilityInfo(user: UserProfile): AvailabilityInfo {
  // Default availability - would be fetched from user preferences
  return {
    isAvailable: user.isActive,
    status: user.isActive ? 'available' : 'unavailable',
    serviceAreas: user.location?.city ? [user.location.city] : [],
    responseTime: "< 2 hours",
  };
}

/**
 * Calculate response rate (success rate)
 */
export function calculateResponseRate(user: UserProfile): number {
  return user.completedTasks && user.totalTasks
    ? Math.round((user.completedTasks / user.totalTasks) * 100)
    : 0; // Show 0% when no tasks
}
