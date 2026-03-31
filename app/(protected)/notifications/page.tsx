"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  ArrowLeft,
  Check,
  Trash2,
  ClipboardList,
  CreditCard,
  Clock3,
  Search,
  Cog,
  Mail,
  BellDot,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/lib/state/notificationStore";
import { useAuth } from "@/lib/auth/context";
import type { InAppNotification } from "@/lib/notifications/pollingService";

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: days > 365 ? "numeric" : undefined,
  });
}

type CategoryVisual = {
  Icon: LucideIcon;
  bgClass: string;
  fgClass: string;
  ringClass?: string;
};

function getCategoryVisual(category?: string): CategoryVisual {
  switch (category) {
    case "taskUpdates":
      return {
        Icon: ClipboardList,
        bgClass: "bg-primary-50",
        fgClass: "text-primary-700",
        ringClass: "ring-primary-100",
      };
    case "payments":
      return {
        Icon: CreditCard,
        bgClass: "bg-emerald-50",
        fgClass: "text-emerald-700",
        ringClass: "ring-emerald-100",
      };
    case "taskReminders":
      return {
        Icon: Clock3,
        bgClass: "bg-amber-50",
        fgClass: "text-amber-700",
        ringClass: "ring-amber-100",
      };
    case "keywordTaskAlerts":
    case "recommendedTaskAlerts":
      return {
        Icon: Search,
        bgClass: "bg-indigo-50",
        fgClass: "text-indigo-700",
        ringClass: "ring-indigo-100",
      };
    case "system":
      return {
        Icon: Cog,
        bgClass: "bg-slate-50",
        fgClass: "text-slate-700",
        ringClass: "ring-slate-100",
      };
    default:
      return {
        Icon: BellDot,
        bgClass: "bg-secondary-50",
        fgClass: "text-secondary-600",
        ringClass: "ring-secondary-100",
      };
  }
}

/**
 * Resolve the navigation URL from a notification's data + category.
 * Falls back gracefully when data is missing.
 */
function resolveNotificationRoute(notif: InAppNotification): string | null {
  const data = notif.data ?? {};

  // Explicit actionUrl field
  if (data.actionUrl) return data.actionUrl as string;
  if (data.route) return data.route as string;

  const taskId = data.taskId || data.entity_id || data.entityId;

  switch (notif.category) {
    case "taskUpdates":
    case "taskReminders":
      if (taskId) return `/tasks/${taskId}`;
      return "/tasks";

    case "payments":
      if (taskId) return `/tasks/${taskId}`;
      return "/tasks";

    case "keywordTaskAlerts":
    case "recommendedTaskAlerts":
      if (taskId) return `/discover?taskId=${taskId}`;
      return "/discover";

    case "system":
      return null; // No navigation for system

    default:
      if (taskId) return `/tasks/${taskId}`;
      return null;
  }
}

export default function NotificationsPage() {
  const router = useRouter();
  const { currentUser, userData } = useAuth();
  const userId = currentUser?.uid || userData?.uid;

  const {
    notifications,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    markAllAsReadOptimistic,
    deleteNotification,
  } = useNotificationStore();

  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (!userId) return;
    fetchNotifications(30, 0);
  }, [userId, fetchNotifications]);

  useEffect(() => {
    // Opening full notifications should clear unread indicators.
    markAllAsReadOptimistic();
    markAllAsRead();
  }, [markAllAsRead, markAllAsReadOptimistic]);

  const handleDelete = useCallback(
    async (e: React.MouseEvent, notifId: string) => {
      e.stopPropagation(); // prevent row click / navigation
      setDeletingIds((prev) => new Set(prev).add(notifId));
      await deleteNotification(notifId);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(notifId);
        return next;
      });
    },
    [deleteNotification]
  );

  const handleRowClick = useCallback(
    async (notif: InAppNotification) => {
      // Mark as read
      if (!notif.read) {
        await markAsRead(notif.id);
      }
      // Navigate
      const route = resolveNotificationRoute(notif);
      if (route) {
        router.push(route);
      }
    },
    [markAsRead, router]
  );

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const more = await fetchNotifications(30, notifications.length);
    if (!more || more.length < 30) setHasMore(false);
    setLoadingMore(false);
  }, [loadingMore, hasMore, fetchNotifications, notifications.length]);

  return (
    <div className="bg-secondary-50 min-h-[calc(100vh-110px)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-white rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Notifications
              </h1>
              <p className="text-sm text-secondary-500 mt-0.5">
                Stay updated on your tasks, offers, and payments.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading && notifications.length === 0 ? (
          /* Loading skeleton */
          <div className="bg-white rounded-xl border border-secondary-200 shadow-sm divide-y divide-secondary-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-secondary-100 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3.5 bg-secondary-100 rounded w-2/3" />
                  <div className="h-3 bg-secondary-100 rounded w-1/2" />
                  <div className="h-2.5 bg-secondary-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-xl border border-secondary-200">
            <div className="w-24 h-24 mb-6 bg-secondary-50 rounded-full flex items-center justify-center">
              <Bell className="w-12 h-12 text-secondary-200" />
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-secondary-500 text-center max-w-sm mb-6">
              When you receive task updates, offers, or payment notifications,
              they will appear here.
            </p>
            <Link href="/home">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                Go to Home
              </Button>
            </Link>
          </div>
        ) : (
          /* Notification list */
          <>
            <div className="bg-white rounded-xl border border-secondary-200 shadow-sm divide-y divide-secondary-100 overflow-hidden">
              {notifications.map((notif: InAppNotification) => {
                const route = resolveNotificationRoute(notif);
                const isDeleting = deletingIds.has(notif.id);
                const isClickable = !!route;
                const { Icon, bgClass, fgClass, ringClass } = getCategoryVisual(
                  notif.category
                );

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleRowClick(notif)}
                    className={`
                      flex gap-4 px-5 py-4 transition-all duration-200 group relative
                      ${isDeleting ? "opacity-40 pointer-events-none" : ""}
                      ${!notif.read ? "bg-primary-50/30" : ""}
                      ${isClickable ? "cursor-pointer hover:bg-secondary-50 active:bg-secondary-100" : ""}
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`relative w-11 h-11 rounded-xl border border-secondary-100 flex items-center justify-center shrink-0 ${bgClass} ${ringClass ?? ""}`}
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon className={`w-4 h-4 ${fgClass}`} />
                      )}
                      {!notif.read && (
                        <span className="absolute -top-1 -right-1 inline-block w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${
                            !notif.read
                              ? "font-semibold text-secondary-900"
                              : "font-medium text-secondary-700"
                          }`}
                        >
                          {notif.title}
                          {!notif.read && (
                            <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 align-middle" />
                          )}
                        </p>
                        <span className="text-[10px] text-secondary-400 shrink-0 mt-0.5">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-500 mt-1 line-clamp-2">
                        {notif.body}
                      </p>
                      {isClickable && (
                        <p className="text-xs text-primary-500 mt-1.5 font-medium">
                          Tap to view →
                        </p>
                      )}
                    </div>

                    {/* Actions — visible on hover */}
                    <div
                      className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()} // block row navigation on action area
                    >
                      {!notif.read && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await markAsRead(notif.id);
                          }}
                          className="p-1.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Mark as read"
                          aria-label="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, notif.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Delete"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-4 flex justify-center">
                <button
                  id="load-more-notifications-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-white px-5 py-2.5 rounded-lg border border-secondary-200 bg-white shadow-sm transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
