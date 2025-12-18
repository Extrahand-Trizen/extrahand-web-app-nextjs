"use client";

/**
 * ActivityFeed Component
 * Minimal activity feed with subtle color accents
 */

import React from "react";
import { useRouter } from "next/navigation";
import {
   Clock,
   CheckCircle2,
   XCircle,
   MessageSquare,
   CreditCard,
   Star,
   Send,
   Play,
   UserCheck,
   Plus,
   ChevronRight,
} from "lucide-react";
import type { ActivityItem, ActivityType } from "@/types/dashboard";

interface ActivityFeedProps {
   activities: ActivityItem[];
   loading?: boolean;
   maxItems?: number;
}

const activityConfig: Record<
   ActivityType,
   { icon: React.ElementType; bg: string; color: string }
> = {
   offer_received: {
      icon: CheckCircle2,
      bg: "bg-primary-100",
      color: "text-primary-600",
   },
   offer_sent: { icon: Send, bg: "bg-blue-100", color: "text-blue-600" },
   offer_accepted: {
      icon: CheckCircle2,
      bg: "bg-green-100",
      color: "text-green-600",
   },
   offer_rejected: { icon: XCircle, bg: "bg-red-100", color: "text-red-600" },
   message_received: {
      icon: MessageSquare,
      bg: "bg-purple-100",
      color: "text-purple-600",
   },
   payment_released: {
      icon: CreditCard,
      bg: "bg-green-100",
      color: "text-green-600",
   },
   payment_received: {
      icon: CreditCard,
      bg: "bg-green-100",
      color: "text-green-600",
   },
   task_completed: {
      icon: CheckCircle2,
      bg: "bg-green-100",
      color: "text-green-600",
   },
   task_started: {
      icon: Play,
      bg: "bg-primary-100",
      color: "text-primary-600",
   },
   task_assigned: {
      icon: UserCheck,
      bg: "bg-blue-100",
      color: "text-blue-600",
   },
   task_posted: {
      icon: Plus,
      bg: "bg-secondary-100",
      color: "text-secondary-600",
   },
   review_received: {
      icon: Star,
      bg: "bg-primary-100",
      color: "text-primary-600",
   },
};

export function ActivityFeed({
   activities,
   loading,
   maxItems = 2,
}: ActivityFeedProps) {
   const router = useRouter();

   if (loading) {
      return <ActivityFeedSkeleton count={maxItems} />;
   }

   if (activities.length === 0) {
      return null;
   }

   const displayActivities = activities.slice(0, maxItems);
   const hasMore = activities.length > maxItems;

   return (
      <section>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-secondary-700">
               Recent Activity
            </h2>
            {hasMore && (
               <button
                  onClick={() => router.push("/activity")}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
               >
                  View all
               </button>
            )}
         </div>

         <div className="bg-white rounded-lg border border-secondary-200 shadow-sm divide-y divide-secondary-100">
            {displayActivities.map((activity) => (
               <ActivityRow
                  key={activity.id}
                  activity={activity}
                  onClick={() =>
                     activity.actionRoute && router.push(activity.actionRoute)
                  }
               />
            ))}
         </div>
      </section>
   );
}

function ActivityRow({
   activity,
   onClick,
}: {
   activity: ActivityItem;
   onClick: () => void;
}) {
   const config = activityConfig[activity.type];
   const Icon = config.icon;

   return (
      <button
         onClick={onClick}
         disabled={!activity.actionRoute}
         className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
            activity.actionRoute
               ? "hover:bg-primary-50 cursor-pointer"
               : "cursor-default"
         }`}
      >
         <div
            className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}
         >
            <Icon className={`w-4 h-4 ${config.color}`} />
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-secondary-900 truncate">
               {activity.title}
            </p>
            <p className="text-xs text-secondary-500 truncate mt-0.5">
               {activity.description}
            </p>
            <p className="text-xs text-secondary-400 mt-1">
               {getRelativeTime(activity.timestamp)}
            </p>
         </div>
      </button>
   );
}

function ActivityFeedSkeleton({ count }: { count: number }) {
   return (
      <section>
         <div className="h-4 w-24 bg-secondary-200 rounded animate-pulse mb-3" />
         <div className="bg-white rounded-lg border border-secondary-200 divide-y divide-secondary-100">
            {Array.from({ length: count }).map((_, i) => (
               <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-200 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1">
                     <div className="h-3 w-3/4 bg-secondary-200 rounded animate-pulse" />
                     <div className="h-2 w-1/2 bg-secondary-200 rounded animate-pulse" />
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}

function getRelativeTime(date: Date): string {
   const now = new Date();
   const diff = now.getTime() - new Date(date).getTime();
   const minutes = Math.floor(diff / 60000);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (minutes < 1) return "Just now";
   if (minutes < 60) return `${minutes}m ago`;
   if (hours < 24) return `${hours}h ago`;
   if (days < 7) return `${days}d ago`;
   return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
   });
}
