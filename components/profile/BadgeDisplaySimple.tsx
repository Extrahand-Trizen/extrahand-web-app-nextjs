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
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-5">
          <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-32 mx-auto bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-20 mx-auto bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="py-5 border-t border-gray-200">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
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
    <div className={`space-y-6 ${className}`}>
      {/* Current Badge Section */}
      <div className="text-center py-5">
        <div className="text-6xl mb-3">{BADGE_EMOJIS[currentBadgeLower] || '⭐'}</div>
        <h2 className="text-2xl font-bold capitalize text-gray-900 mb-1">{badgeData.currentBadge} Badge</h2>
        <p className="text-gray-600 mb-3 text-sm">Reputation Score</p>
        <div className="inline-block text-3xl font-bold text-gray-900">{Math.round(badgeData.currentReputation)}/100</div>
      </div>

      {/* Badge Journey */}
      <div className="py-5">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5">Your Badge Journey</h3>
        <div className="flex items-center justify-between gap-2">
          {badges.map((badge, idx) => {
            const isActive = idx === currentBadgeIndex;
            const isPassed = idx < currentBadgeIndex;
            const isNext = idx === currentBadgeIndex + 1;

            return (
              <div key={badge} className="flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
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
                  <span className="text-xs font-medium text-gray-600 mt-2 text-center capitalize block">{badge}</span>
                  {isActive && <span className="text-xs font-bold text-blue-600 mt-1">Current</span>}
                  {isPassed && <span className="text-xs text-green-600 font-semibold mt-1">✓ Achieved</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Badge Requirements Grid */}
      <div className="py-5">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5">Badge Tiers & Requirements</h3>
        <div className="space-y-4">
          {badges.map((badge) => {
            const req = requirements[badge];
            if (!req) return null;
            
            const isCurrentOrPassed = badges.indexOf(badge) <= currentBadgeIndex;
            const badgeLower = badge.toLowerCase();
            
            return (
              <div
                key={badge}
                className={`p-4 transition-all ${
                  isCurrentOrPassed
                    ? 'border-b-2 border-green-600'
                    : 'border-b border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {BADGE_EMOJIS[badgeLower]}
                    </div>
                    <div>
                      <p className={`text-base font-bold capitalize ${isCurrentOrPassed ? 'text-gray-900' : 'text-gray-700'}`}>
                        {badge} Badge
                      </p>
                      <p className={`text-xs ${isCurrentOrPassed ? 'text-gray-700' : 'text-gray-600'}`}>
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 text-center bg-gray-50 rounded-lg">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase">Reputation</p>
                    <p className="text-lg font-bold text-gray-900">{req.minReputation}<span className="text-xs text-gray-500 font-normal">/100</span></p>
                  </div>
                  <div className="p-3 text-center bg-gray-50 rounded-lg">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase">Tasks</p>
                    <p className="text-lg font-bold text-gray-900">{req.minTasks}</p>
                  </div>
                  <div className="p-3 text-center bg-gray-50 rounded-lg">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase">Rating</p>
                    <p className="text-lg font-bold text-gray-900">⭐{req.minRating}</p>
                  </div>
                  <div className="p-3 text-center bg-gray-50 rounded-lg">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase">Reviews</p>
                    <p className="text-lg font-bold text-gray-900">{req.minReviews}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works - compact grid */}
      <div className="py-5 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">How Badge Progression Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">1</div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Complete Tasks & Build Reputation</p>
              <p className="text-xs text-gray-600 mt-0.5">Earn reputation points by completing tasks successfully</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">2</div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Maintain High Ratings</p>
              <p className="text-xs text-gray-600 mt-0.5">Keep your average rating above the required threshold</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">3</div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Automatic Progression</p>
              <p className="text-xs text-gray-600 mt-0.5">When all requirements are met, you'll be automatically upgraded</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">4</div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Unlock Benefits</p>
              <p className="text-xs text-gray-600 mt-0.5">Enjoy lower fees, better visibility, and premium features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
