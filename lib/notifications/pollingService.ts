/**
 * Polling-based In-App Notification Service
 * Provides fallback/alternative to FCM for fetching notifications
 */

import logger from '@/lib/config/logger';

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  category?: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationResponse {
  success: boolean;
  notifications: InAppNotification[];
  unreadCount: number;
  hasMore: boolean;
}

/**
 * Notification polling service configuration
 */
type PollConfig = {
  enabled: boolean;
  interval: number; // ms
  maxRetries: number;
  backoffMultiplier: number;
  onNotification?: (notification: InAppNotification) => void;
  onError?: (error: Error) => void;
};

/**
 * In-App Notification Polling Service
 */
export class NotificationPollingService {
  private static pollingIntervalId: NodeJS.Timeout | null = null;
  private static config: PollConfig = {
    enabled: true,
    interval: 60000, // 1 minute default
    maxRetries: 3,
    backoffMultiplier: 1.5
  };
  private static retryCount = 0;
  private static currentBackoffDelay = this.config.interval;
  private static lastVisitedUserId: string | null = null;
  private static isPolling = false;

  /**
   * Initialize polling service with custom config
   */
  static initialize(customConfig?: Partial<PollConfig>): void {
    if (typeof window === 'undefined') return;

    this.config = { ...this.config, ...customConfig };
    this.currentBackoffDelay = this.config.interval;
    
    console.log('✅ Notification Polling Service initialized', {
      interval: this.config.interval,
      enabled: this.config.enabled
    });
  }

  /**
   * Start polling for notifications
   */
  static startPolling(userId: string, customInterval?: number): void {
    if (typeof window === 'undefined') return;

    if (!this.config.enabled) {
      console.log('⚠️ Polling service is disabled');
      return;
    }

    if (this.isPolling && this.lastVisitedUserId === userId) {
      console.log('⚠️ Polling already active for this user');
      return;
    }

    this.lastVisitedUserId = userId;
    this.isPolling = true;
    const interval = customInterval || this.config.interval;

    console.log('🔔 Starting notification polling', { userId, interval });

    // Poll immediately first
    this.poll(userId);

    // Then set up interval
    this.pollingIntervalId = setInterval(() => {
      this.poll(userId);
    }, interval);
  }

  /**
   * Stop polling notifications
   */
  static stopPolling(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
      this.isPolling = false;
      this.retryCount = 0;
      this.currentBackoffDelay = this.config.interval;
      console.log('⏹️ Notification polling stopped');
    }
  }

  /**
   * Perform single poll request
   */
  private static async poll(userId: string): Promise<void> {
    try {
      const notifications = await this.fetchNotifications(userId);
      
      // Reset retry count on success
      this.retryCount = 0;
      this.currentBackoffDelay = this.config.interval;

      // Process each unread notification
      if (notifications && notifications.length > 0) {
        console.log(`📮 Fetched ${notifications.length} notifications`);
        
        // Call callback for each new notification
        notifications.forEach(notification => {
          if (!notification.read && this.config.onNotification) {
            this.config.onNotification(notification);
          }
        });
      }
    } catch (error) {
      this.handlePollError(error as Error);
    }
  }

  /**
   * Fetch notifications from backend
   */
  static async fetchNotifications(
    userId: string,
    limit: number = 50,
    skip: number = 0,
    unreadOnly: boolean = true
  ): Promise<InAppNotification[] | null> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
        unreadOnly: unreadOnly.toString()
      });

      const url = `/api/notifications?${params}`;
      console.log('📡 Fetching notifications from:', url);
      console.log('🔍 User ID:', userId);

      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      console.log('📊 Notification response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Notification fetch error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data: NotificationResponse = await response.json();
      console.log('✅ Notifications fetched successfully:', data.notifications?.length || 0);
      return data.notifications || [];
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return true;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<boolean> {
    try {
      const response = await fetch(
        '/api/notifications/mark-all-read',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      return true;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      return true;
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await fetch(
        '/api/notifications/unread-count',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = await response.json();
      return data.unreadCount || 0;
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Handle polling errors with exponential backoff
   */
  private static handlePollError(error: Error): void {
    this.retryCount++;

    if (this.retryCount > this.config.maxRetries) {
      console.error('❌ Max retries exceeded for polling:', error);
      this.stopPolling();
      
      if (this.config.onError) {
        this.config.onError(error);
      }
      return;
    }

    // Exponential backoff
    this.currentBackoffDelay = this.config.interval * 
      Math.pow(this.config.backoffMultiplier, this.retryCount);

    console.warn(`⚠️ Polling error (attempt ${this.retryCount}):`, error);
    console.log(`📊 Next retry in ${this.currentBackoffDelay}ms`);
  }

  /**
   * Set retry configuration
   */
  static setRetryConfig(maxRetries: number, backoffMultiplier: number): void {
    this.config.maxRetries = maxRetries;
    this.config.backoffMultiplier = backoffMultiplier;
  }

  /**
   * Disable/enable polling
   */
  static setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled && this.isPolling) {
      this.stopPolling();
    }
  }

  /**
   * Get polling status
   */
  static getStatus(): {
    isPolling: boolean;
    retryCount: number;
    currentBackoffDelay: number;
    config: PollConfig;
  } {
    return {
      isPolling: this.isPolling,
      retryCount: this.retryCount,
      currentBackoffDelay: this.currentBackoffDelay,
      config: { ...this.config }
    };
  }
}

export default NotificationPollingService;
