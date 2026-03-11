"use client";

/**
 * Notification Center Component
 * Bell icon with live dropdown — shows latest 3 notifications.
 * "View all notifications" → /notifications page.
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { useNotificationStore } from "@/lib/state/notificationStore";
import { useAuth } from "@/lib/auth/context";

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationCenter() {
  const router = useRouter();
  const { currentUser, userData } = useAuth();
  const userId = currentUser?.uid || userData?.uid;

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    markAllAsReadOptimistic,
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasFetched = useRef(false);

  // Fetch on mount when user is available
  useEffect(() => {
    if (!userId || hasFetched.current) return;
    hasFetched.current = true;
    fetchNotifications(20, 0);
  }, [userId, fetchNotifications]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications(20, 0);
    }
  }, [isOpen, userId, fetchNotifications]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = useCallback(async () => {
    markAllAsReadOptimistic();
    await markAllAsRead();
  }, [markAllAsRead, markAllAsReadOptimistic]);

  const handleNotificationClick = useCallback(
    async (id: string, read: boolean) => {
      if (!read) await markAsRead(id);
    },
    [markAsRead]
  );

  // Show only the 3 most recent
  const preview = notifications.slice(0, 3);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-0.5 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-secondary-200 shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-secondary-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1 text-secondary-400 hover:text-primary-600 transition-colors"
                    title="Mark all as read"
                    aria-label="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[320px] overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex flex-col gap-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-secondary-100 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-secondary-100 rounded w-3/4" />
                        <div className="h-3 bg-secondary-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : preview.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <Bell className="w-8 h-8 text-secondary-200 mb-2" />
                  <p className="text-sm font-medium text-secondary-500">
                    No notifications yet
                  </p>
                  <p className="text-xs text-secondary-400 mt-1">
                    We&apos;ll notify you when something happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-secondary-50">
                  {preview.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() =>
                        handleNotificationClick(notif.id, notif.read)
                      }
                      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-secondary-50 transition-colors ${
                        !notif.read ? "bg-primary-50/40" : ""
                      }`}
                    >
                      {/* Unread dot */}
                      <div className="flex-shrink-0 mt-1.5">
                        {notif.read ? (
                          <div className="w-2 h-2 rounded-full bg-transparent" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-snug line-clamp-1 ${
                            notif.read
                              ? "text-secondary-600 font-normal"
                              : "text-secondary-900 font-semibold"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-xs text-secondary-500 mt-0.5 line-clamp-2">
                          {notif.body}
                        </p>
                        <p className="text-[10px] text-secondary-400 mt-1">
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="flex-shrink-0 p-1 text-secondary-300 hover:text-primary-500 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-secondary-100 p-2">
              <button
                id="view-all-notifications-btn"
                onClick={() => {
                  router.push("/notifications");
                  setIsOpen(false);
                }}
                className="w-full text-center text-xs font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 py-2 rounded-lg transition-colors"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
