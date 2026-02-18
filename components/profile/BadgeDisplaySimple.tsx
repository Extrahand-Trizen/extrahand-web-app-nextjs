'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBadgeProgress } from '@/lib/api/badge';
import LoadingSpinner from '../LoadingSpinner';

interface BadgeDisplaySimpleProps {
  className?: string;
}

const BADGE_EMOJIS: Record<string, string> = {
  none: '⭐',
  basic: '🥉',
  verified: '🥈',
  trusted: '🥇',
  elite: '👑',
};

const BADGE_GRADIENT: Record<string, string> = {
  none: 'from-slate-400 to-slate-600',
  basic: 'from-orange-400 to-orange-600',
  verified: 'from-blue-400 to-blue-600',
  trusted: 'from-yellow-400 to-yellow-600',
  elite: 'from-purple-500 to-purple-700',
};

export default function BadgeDisplaySimple({ className = '' }: BadgeDisplaySimpleProps) {
  const { data: badgeData, isLoading, error } = useQuery({
    queryKey: ['badgeProgress'],
    queryFn: getBadgeProgress,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error('Badge loading error:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium mb-2">Failed to load badge information</p>
        <p className="text-sm text-red-500">Please try refreshing the page</p>
      </div>
    );
  }

  if (!badgeData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No badge data available</p>
      </div>
    );
  }

  const badges = ['none', 'basic', 'verified', 'trusted', 'elite'];
  const currentBadgeIndex = badges.indexOf(badgeData.currentBadge?.toLowerCase());
  const requirements = badgeData.badgeRequirements || {};
  const currentBadgeLower = badgeData.currentBadge?.toLowerCase() || 'none';

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Current Badge Section */}
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{BADGE_EMOJIS[currentBadgeLower] || '⭐'}</div>
        <h2 className="text-3xl font-bold capitalize text-gray-900 mb-2">{badgeData.currentBadge} Badge</h2>
        <p className="text-gray-600 mb-6">Reputation Score</p>
        <div className="inline-block text-4xl font-bold text-gray-900">{Math.round(badgeData.currentReputation)}/100</div>
      </div>

      {/* Badge Journey */}
      <div className="py-8">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-8">Your Badge Journey</h3>
        <div className="flex items-center justify-between gap-2">
          {badges.map((badge, idx) => {
            const isActive = idx === currentBadgeIndex;
            const isPassed = idx < currentBadgeIndex;
            const isNext = idx === currentBadgeIndex + 1;

            return (
              <div key={badge} className="flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                      isActive
                        ? 'scale-110 shadow-lg'
                        : isPassed
                        ? ''
                        : isNext
                        ? ''
                        : 'opacity-50'
                    }`}
                  >
                    {BADGE_EMOJIS[badge]}
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-3 text-center capitalize block">{badge}</span>
                  {isActive && <span className="text-xs font-bold text-blue-600 mt-1">Current</span>}
                  {isPassed && <span className="text-xs text-green-600 font-semibold mt-1">✓ Achieved</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Badge Requirements Grid */}
      <div className="py-8">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-8">Badge Tiers & Requirements</h3>
        <div className="space-y-6">
          {badges.map((badge) => {
            const req = requirements[badge];
            if (!req) return null;
            
            const isCurrentOrPassed = badges.indexOf(badge) <= currentBadgeIndex;
            const badgeLower = badge.toLowerCase();
            
            return (
              <div
                key={badge}
                className={`p-6 transition-all ${
                  isCurrentOrPassed
                    ? 'border-b-2 border-green-600'
                    : 'border-b border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {BADGE_EMOJIS[badgeLower]}
                    </div>
                    <div>
                      <p className={`text-lg font-bold capitalize ${isCurrentOrPassed ? 'text-gray-900' : 'text-gray-700'}`}>
                        {badge} Badge
                      </p>
                      <p className={`text-sm ${isCurrentOrPassed ? 'text-gray-700' : 'text-gray-600'}`}>
                        {req.description}
                      </p>
                    </div>
                  </div>
                  {isCurrentOrPassed && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      badges.indexOf(badge) === currentBadgeIndex
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {badges.indexOf(badge) === currentBadgeIndex ? 'CURRENT' : 'ACHIEVED'}
                    </span>
                  )}
                </div>

                {/* Requirements Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Reputation</p>
                    <p className="text-2xl font-bold text-gray-900">{req.minReputation}</p>
                    <p className="text-xs text-gray-500">/100</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{req.minTasks}</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">⭐{req.minRating}</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{req.minReviews}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-8 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">How Badge Progression Works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <p className="font-semibold text-gray-900">Complete Tasks & Build Reputation</p>
              <p className="text-sm text-gray-700 mt-1">Earn reputation points by completing tasks successfully</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <p className="font-semibold text-gray-900">Maintain High Ratings</p>
              <p className="text-sm text-gray-700 mt-1">Keep your average rating above the required threshold</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <p className="font-semibold text-gray-900">Automatic Progression</p>
              <p className="text-sm text-gray-700 mt-1">When all requirements are met, you'll be automatically upgraded</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <p className="font-semibold text-gray-900">Unlock Benefits</p>
              <p className="text-sm text-gray-700 mt-1">Enjoy lower fees, better visibility, and premium features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
