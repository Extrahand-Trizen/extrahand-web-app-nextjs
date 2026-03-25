'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBadgeProgress, checkBadgeUpgrade } from '@/lib/api/badge';
import { BadgeCheck, Crown, Shield, ShieldCheck } from 'lucide-react';

interface BadgeDisplaySimpleProps {
  className?: string;
}

const BADGE_VISUALS = {
  basic: {
    icon: Shield,
    accent: 'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 ring-1 ring-slate-300',
    chip: 'bg-slate-100 text-slate-700',
  },
  verified: {
    icon: ShieldCheck,
    accent: 'bg-gradient-to-b from-blue-50 to-blue-100 text-blue-700 ring-1 ring-blue-200',
    chip: 'bg-blue-50 text-blue-700',
  },
  trusted: {
    icon: BadgeCheck,
    accent: 'bg-gradient-to-b from-emerald-50 to-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    chip: 'bg-emerald-50 text-emerald-700',
  },
  elite: {
    icon: Crown,
    accent: 'bg-gradient-to-b from-amber-50 to-amber-100 text-amber-700 ring-1 ring-amber-200',
    chip: 'bg-amber-50 text-amber-700',
  },
};

const BADGE_NOTES: Record<string, string> = {
  basic: 'Email + phone verified',
  verified: 'Aadhaar verified',
  trusted: 'PAN + bank verified',
  elite: 'Admin approval required',
};

// Default data shown when the API has no record for this user yet
const DEFAULT_BADGE_DATA = {
  currentBadge: 'none',
  currentReputation: 0,
  badgeRequirements: {
    basic:   { minReputation: 10, minTasks: 0, minRating: 0, description: 'Get started on the platform' },
    verified:{ minReputation: 25, minTasks: 0, minRating: 0, description: 'Complete Aadhaar verification' },
    trusted: { minReputation: 50, minTasks: 3, minRating: 4, description: 'Build a strong track record' },
    elite:   { minReputation: 100, minTasks: 10, minRating: 4.5, description: 'Top-tier platform member' },
  },
};

export default function BadgeDisplaySimple({ className = '' }: BadgeDisplaySimpleProps) {
  const queryClient = useQueryClient();
  const [initialized, setInitialized] = React.useState(false);

  const { data: badgeData, isLoading, error } = useQuery({
    queryKey: ['badgeProgress'],
    queryFn: getBadgeProgress,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Auto-initialize badge record on first failure, then re-fetch
  React.useEffect(() => {
    if (error && !initialized) {
      setInitialized(true);
      checkBadgeUpgrade()
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['badgeProgress'] });
        })
        .catch(() => {
          // silently ignore — we'll show the default view below
        });
    }
  }, [error, initialized, queryClient]);

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

  // Use fetched data or fall back to defaults — never show a red error
  const data = badgeData ?? DEFAULT_BADGE_DATA;

  const badges = ['basic', 'verified', 'trusted', 'elite'];
  const currentBadgeLower = data.currentBadge?.toLowerCase() || 'none';
  const displayBadge = currentBadgeLower === 'none' ? 'basic' : currentBadgeLower;
  const currentBadgeIndex = badges.indexOf(displayBadge);
  const currentBadgeVisual = BADGE_VISUALS[(displayBadge as keyof typeof BADGE_VISUALS)] || BADGE_VISUALS.basic;
  const CurrentBadgeIcon = currentBadgeVisual.icon;
  const requirements = data.badgeRequirements || {};
  const badgeLabel = `${displayBadge.charAt(0).toUpperCase()}${displayBadge.slice(1)}`;

  const getRequiredCriteria = (badge: string, req: { minReputation: number; minTasks: number; minRating: number }) => {
    const criteria: string[] = [];
    if (BADGE_NOTES[badge]) criteria.push(BADGE_NOTES[badge]);
    if (req.minReputation > 0) criteria.push(`Reputation ${req.minReputation}+`);
    if (req.minTasks > 0) criteria.push(`${req.minTasks} tasks`);
    if (req.minRating > 0) criteria.push(`${req.minRating}+ rating`);
    return criteria;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Badge Section */}
      <div className="text-center py-5">
        <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full shadow-sm ${currentBadgeVisual.accent}`}>
          <CurrentBadgeIcon className="h-8 w-8" strokeWidth={2.1} />
        </div>
        <h2 className="text-2xl font-bold capitalize text-gray-900 mb-1">{badgeLabel} Badge</h2>
        <p className="text-gray-600 mb-3 text-sm">Reputation Score</p>
        <div className="inline-block text-3xl font-bold text-gray-900">{Math.round(data.currentReputation)}/100</div>
      </div>

      {/* Badge Requirements */}
      <div className="py-5">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5">Badge Tiers</h3>
        <div className="space-y-4">
          {badges.map((badge) => {
            const req = requirements[badge];
            if (!req) return null;
            
            const isCurrentOrPassed = badges.indexOf(badge) <= currentBadgeIndex;
            const criteria = getRequiredCriteria(badge, req);

            return (
              <div
                key={badge}
                className={`rounded-xl border p-4 transition-all ${
                  isCurrentOrPassed
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm ${BADGE_VISUALS[badge as keyof typeof BADGE_VISUALS].accent}`}>
                      {React.createElement(BADGE_VISUALS[badge as keyof typeof BADGE_VISUALS].icon, { className: 'h-5 w-5', strokeWidth: 2.1 })}
                    </div>
                    <div>
                      <p className={`text-base font-bold capitalize ${isCurrentOrPassed ? 'text-gray-900' : 'text-gray-700'}`}>
                        {badge} Badge
                      </p>
                      <p className={`text-sm ${isCurrentOrPassed ? 'text-gray-700' : 'text-gray-600'}`}>{req.description}</p>
                    </div>
                  </div>
                  {isCurrentOrPassed && (
                    <span className={`shrink-0 text-[11px] font-bold px-3 py-1 rounded-full ${
                      badges.indexOf(badge) === currentBadgeIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {badges.indexOf(badge) === currentBadgeIndex ? 'CURRENT' : 'ACHIEVED'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {criteria.map((item) => (
                    <span
                      key={item}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${BADGE_VISUALS[badge as keyof typeof BADGE_VISUALS].chip}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
