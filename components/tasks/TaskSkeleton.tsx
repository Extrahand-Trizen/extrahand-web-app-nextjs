"use client";

/**
 * TaskCardSkeleton - Loading placeholder for task cards
 * Matches the Airtasker-style card layout
 */
export function TaskCardSkeleton() {
  return (
    <div className="bg-white border-b border-secondary-200 p-4 animate-pulse">
      {/* Title skeleton */}
      <div className="h-5 bg-secondary-200 rounded w-3/4 mb-2"></div>
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-secondary-200 rounded w-full"></div>
        <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
      </div>

      {/* Meta info skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-3 bg-secondary-200 rounded w-20"></div>
          <div className="h-3 bg-secondary-200 rounded w-16"></div>
          <div className="h-3 bg-secondary-200 rounded w-16"></div>
        </div>
        <div className="h-5 bg-secondary-200 rounded w-16"></div>
      </div>
    </div>
  );
}

/**
 * TaskListSkeleton - Shows multiple loading cards
 */
export function TaskListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}
