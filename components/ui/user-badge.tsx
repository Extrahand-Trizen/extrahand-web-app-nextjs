'use client';

import { Shield, ShieldCheck, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type BadgeType = 'none' | 'basic' | 'verified' | 'trusted' | 'elite';

interface UserBadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  clickable?: boolean;
}

const badgeConfig = {
  none: {
    icon: null,
    label: '',
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
  },
  basic: {
    icon: Shield,
    label: 'Basic',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  verified: {
    icon: ShieldCheck,
    label: 'Verified',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  trusted: {
    icon: Award,
    label: 'Trusted',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  elite: {
    icon: Star,
    label: 'Elite',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
};

export function UserBadge({ 
  badge, 
  size = 'sm', 
  showLabel = false,
  className,
  clickable = false
}: UserBadgeProps) {
  if (badge === 'none') return null;

  const config = badgeConfig[badge];
  const Icon = config.icon;

  if (!Icon) return null;

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const badgeContent = showLabel ? (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium',
        config.color,
        config.bgColor,
        textSizeClasses[size],
        clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
    >
      <Icon className={sizeClasses[size]} />
      {config.label}
    </span>
  ) : (
    <span
      className={cn(
        'inline-flex items-center',
        config.color,
        clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      title={config.label}
    >
      <Icon className={sizeClasses[size]} />
    </span>
  );

  if (clickable) {
    return (
      <Link href="/profile?section=badges" onClick={(e) => e.stopPropagation()}>
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
