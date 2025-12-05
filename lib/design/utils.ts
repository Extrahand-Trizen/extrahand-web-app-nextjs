/**
 * Design system utility functions
 */

import { designTokens } from './tokens';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get color value from design tokens
 */
export function getColor(
  colorFamily: keyof typeof designTokens.colors,
  shade?: string | number
): string {
  const family = designTokens.colors[colorFamily];
  if (typeof family === 'object' && shade !== undefined) {
    return (family as Record<string, string>)[String(shade)] || '';
  }
  return typeof family === 'string' ? family : '';
}

/**
 * Get spacing value from design tokens
 */
export function getSpacing(scale: keyof typeof designTokens.spacing): string {
  return designTokens.spacing[scale];
}

/**
 * Get typography value from design tokens
 */
export function getTypography(
  property: 'fontSize' | 'fontWeight' | 'lineHeight',
  scale: string
): string | number {
  return (designTokens.typography[property] as Record<string, string | number>)[scale] || '';
}

/**
 * Get border radius value from design tokens
 */
export function getBorderRadius(scale: keyof typeof designTokens.borderRadius): string {
  return designTokens.borderRadius[scale];
}

/**
 * Get shadow value from design tokens
 */
export function getShadow(scale: keyof typeof designTokens.shadows): string {
  return designTokens.shadows[scale];
}

/**
 * Get breakpoint value from design tokens
 */
export function getBreakpoint(scale: keyof typeof designTokens.breakpoints): string {
  return designTokens.breakpoints[scale];
}


