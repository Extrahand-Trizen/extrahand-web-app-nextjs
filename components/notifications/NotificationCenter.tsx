/**
 * In-App Notifications Display Component
 * Shows notifications as toasts or in a notification center
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInAppNotifications, InAppNotification } from '@/hooks/useInAppNotifications';

interface NotificationToastProps {
  notification: InAppNotification;
  onClose: () => void;
  onMarkRead?: () => void;
}

/**
 * Individual notification toast component
 */
const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onMarkRead
}) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-lg mb-3 flex items-start gap-3
        transition-all duration-300 ease-in-out
        ${notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
        ${notification.read ? 'opacity-50' : 'opacity-100'}
        text-white max-w-md
      `}
      role="alert"
    >
      <div className="flex-1">
        <div className="font-semibold text-sm">{notification.title}</div>
        <div className="text-xs mt-1">{notification.body}</div>
      </div>
      <button
        onClick={() => {
          onMarkRead?.();
          onClose();
        }}
        className="text-xl font-bold hover:opacity-70 transition-opacity flex-shrink-0"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

interface NotificationCenterProps {
  maxVisible?: number;
}

/**
 * Notification center component
 * Displays recent notifications as toasts
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  maxVisible = 3
}) => {
  const { notifications, markAsRead, deleteNotification } = useInAppNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<InAppNotification[]>([]);

  // Update visible notifications
  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, maxVisible));
  }, [notifications, maxVisible]);

  const handleClose = useCallback((notificationId: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const handleMarkRead = useCallback(
    async (notificationId: string) => {
      await markAsRead(notificationId);
    },
    [markAsRead]
  );

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-h-96 overflow-y-auto"
      role="region"
      aria-label="Notifications"
    >
      {visibleNotifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => handleClose(notification.id)}
          onMarkRead={() => handleMarkRead(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full notification panel
 * Shows all notifications in a sidebar/modal
 */
export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useInAppNotifications();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg transition-transform duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-gray-500 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-4 bg-gray-50 border-b flex gap-2">
            <button
              onClick={() => markAllAsRead()}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="overflow-y-auto h-full pb-20">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                      aria-label="Delete"
                    >
                      ✕
                    </button>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Notification badge component
 * Shows unread count
 */
interface NotificationBadgeProps {
  onClick?: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ onClick }) => {
  const { unreadCount } = useInAppNotifications();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      aria-label={`${unreadCount} unread notifications`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationCenter;
