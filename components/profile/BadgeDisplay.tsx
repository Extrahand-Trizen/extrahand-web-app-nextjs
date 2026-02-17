'use client';

import React, { useState } from 'react';
import { Award, CheckCircle, Lock, Zap, TrendingUp, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBadgeProgress, BADGE_COLORS, BADGE_EMOJIS } from '@/lib/api/badge';
import type { BadgeProgressData, BadgeLevel } from '@/types/badge';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'sonner';

interface BadgeDisplayProps {
  showDetails?: boolean;
  className?: string;
}

export default function BadgeDisplay({
  showDetails: defaultShowDetails = false,
  className = '',
}: BadgeDisplayProps) {
  const [showDetails, setShowDetails] = useState(defaultShowDetails);

  const {
    data: badgeProgress,
    isLoading,
    error,
  } = useQuery<BadgeProgressData>({
    queryKey: ['badgeProgress'],
    queryFn: getBadgeProgress,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    toast.error('Failed to load badge information');
    return null;
  }

  if (!badgeProgress) {
    return null;
  }

  const badgeConfig: Record<BadgeLevel, { color: string; icon: string; description: string; benefits: string[] }> = {
    Bronze: {
      color: 'bg-orange-100',
      icon: '🥉',
      description: 'Bronze Member',
      benefits: ['Browse all tasks', 'Apply for tasks', '7% platform fee', 'Email support'],
    },
    Silver: {
      color: 'bg-gray-100',
      icon: '🥈',
      description: 'Silver Member',
      benefits: ['Priority visibility', '6% platform fee', 'Post tasks', 'Email support'],
    },
    Gold: {
      color: 'bg-yellow-100',
      icon: '🥇',
      description: 'Gold Member',
      benefits: ['Featured listing', '5% platform fee', 'Instant payouts', 'Priority support'],
    },
    Platinum: {
      color: 'bg-blue-100',
      icon: '💎',
      description: 'Platinum Member',
      benefits: ['Homepage featured', '4% platform fee', 'Instant payouts', 'Dedicated support'],
    },
    Elite: {
      color: 'bg-purple-100',
      icon: '👑',
      description: 'Elite Member',
      benefits: ['VIP status', '3% platform fee', 'Instant payouts', '24/7 support'],
    },
  };

  const config = badgeConfig[badgeProgress.currentBadge];
  const nextBadgeConfig = badgeProgress.nextBadge ? badgeConfig[badgeProgress.nextBadge] : null;

  const progressPercentages = {
    reputation: Math.min((badgeProgress.currentReputation / badgeProgress.nextRepThreshold) * 100, 100),
    tasks: Math.min((badgeProgress.completedTasks / badgeProgress.tasksNeeded) * 100, 100),
    rating: Math.min((badgeProgress.currentRating / badgeProgress.ratingNeeded) * 100, 100),
  };

  const overallProgress = Math.min(
    (progressPercentages.reputation + progressPercentages.tasks + progressPercentages.rating) / 3,
    100
  );

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Current Badge Card */}
      <div className={`${config.color} rounded-xl shadow-lg p-8 text-center border-2 border-gray-300`}>
        <div className="text-6xl mb-4">{config.icon}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{config.description}</h2>

        {/* Reputation Score */}
        <div className="mt-6">
          <p className="text-gray-700 font-medium mb-2">Your Reputation</p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-48 h-3 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${progressPercentages.reputation}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">{Math.round(badgeProgress.currentReputation)}</span>
          </div>
        </div>

        {/* Fee Information */}
        <div className="mt-6 pt-6 border-t border-gray-400">
          <p className="text-gray-700 font-medium mb-2">Your Platform Fee</p>
          <p className="text-4xl font-bold text-gray-900">{badgeProgress.platformFeePercentage}%</p>
          {badgeProgress.nextBadge && (
            <p className="text-sm text-gray-600 mt-2">
              Upgrade to {badgeProgress.nextBadge} to reduce fees
            </p>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-gray-400">
          <p className="text-sm font-medium text-gray-700 mb-4">Current Benefits:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {config.benefits.map((benefit, idx) => (
              <span key={idx} className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 font-medium">
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress to Next Badge */}
      {badgeProgress.nextBadge && nextBadgeConfig && (
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Zap size={24} className="text-blue-600" />
            Progress to {nextBadgeConfig.description}
          </h3>

          {/* Overall Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-lg font-bold text-blue-600">{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Reputation */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-blue-600" />
                Reputation
              </h4>
              <div className="space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progressPercentages.reputation}%` }}
                  />
                </div>
                <p className="text-sm text-gray-700">
                  {Math.round(badgeProgress.currentReputation)}/{Math.round(badgeProgress.nextRepThreshold)}
                </p>
              </div>
            </div>

            {/* Tasks Completed */}
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-green-600" />
                Tasks
              </h4>
              <div className="space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${progressPercentages.tasks}%` }}
                  />
                </div>
                <p className="text-sm text-gray-700">
                  {Math.round(badgeProgress.completedTasks)}/{Math.round(badgeProgress.tasksNeeded)}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Star size={18} className="text-yellow-600" />
                Rating
              </h4>
              <div className="space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${progressPercentages.rating}%` }}
                  />
                </div>
                <p className="text-sm text-gray-700">
                  {badgeProgress.currentRating.toFixed(1)}/{badgeProgress.ratingNeeded.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Next Badge Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform fee reduction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {badgeProgress.platformFeePercentage}% → {(badgeProgress.platformFeePercentage - 1)}%
                </p>
              </div>
              <Award size={32} className="text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Elite Badge Approval Notice */}
      {badgeProgress.currentBadge === 'Elite' && (
        <div className="bg-purple-50 rounded-xl shadow-md p-6 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <Lock size={28} className="text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Elite Badge Status</h3>
              <p className="text-gray-700 mb-2">
                You've achieved the Elite badge status! Our team will review your profile and notify you of approval within 5-7 business days.
              </p>
              <p className="text-gray-600 text-sm">
                Elite members enjoy 3% platform fees, featured homepage placement, exclusive high-value tasks, and 24/7 dedicated support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Button */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          {showDetails ? 'Hide' : 'Show'} Badge Details
        </button>
      </div>

      {/* Detailed Info */}
      {showDetails && (
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Badge Tiers</h3>

          <div className="space-y-4">
            {(['Bronze', 'Silver', 'Gold', 'Platinum', 'Elite'] as const).map((badge) => {
              const cfg = badgeConfig[badge];
              return (
                <div
                  key={badge}
                  className={`p-5 rounded-lg border-2 transition-all ${
                    badge === badgeProgress.currentBadge
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{cfg.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{cfg.description}</h4>
                        <p className="text-sm text-gray-600">
                          {badge === 'Bronze' ? '7' : badge === 'Silver' ? '6' : badge === 'Gold' ? '5' : badge === 'Platinum' ? '4' : '3'}% platform fee
                        </p>
                      </div>
                    </div>
                    {badge === badgeProgress.currentBadge && (
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">Current</span>
                    )}
                  </div>
                  <ul className="text-sm text-gray-700 ml-16 space-y-2">
                    {cfg.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* How It Works */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-300 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">How Badge Upgrades Work</h4>
            <ul className="text-sm text-gray-700 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">1.</span>
                <span>Your badge is automatically checked after completing each task</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">2.</span>
                <span>Upgrades happen automatically when you meet all three requirements (reputation, tasks, rating)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">3.</span>
                <span>Elite badge requires manual admin review</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">4.</span>
                <span>You'll receive a notification when your badge is upgraded</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">5.</span>
                <span>Lower platform fees are applied immediately upon upgrade</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
