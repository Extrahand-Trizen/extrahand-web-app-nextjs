/**
 * Firebase Cloud Messaging Utilities
 * Handles FCM token registration and foreground message listening
 */

import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';
import { app } from '@/lib/auth/firebase';
import { isDevClient } from '@/lib/config';

// VAPID key for web push (should match your Firebase Console settings)
// This is a public key and safe to expose
const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

// Print environment variables for debugging (development only)
if (typeof window !== 'undefined' && isDevClient()) {
  const timestamp = new Date().toLocaleTimeString();
  console.log('%c📋 FIREBASE MESSAGING MODULE LOADED [' + timestamp + ']', 'background: #ff6b6b; color: white; padding: 8px 12px; font-weight: bold;');
  console.log('✅ NEXT_PUBLIC_VAPID_KEY:', VAPID_KEY || '❌ NOT SET');
  console.log('✅ NEXT_PUBLIC_NOTIFICATION_SERVICE_URL:', process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || '❌ NOT SET');
  console.log('✅ NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL || '❌ NOT SET');
  console.log('✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ NOT SET');
  console.log('✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '❌ NOT SET');
  console.log('✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ NOT SET');
  console.log('✅ NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '❌ NOT SET');
  console.log('%c========================================', 'background: #ff6b6b; color: white; padding: 8px;');
}

// Validate VAPID key at module load
if (!VAPID_KEY && typeof window !== 'undefined') {
  console.error('❌ NEXT_PUBLIC_VAPID_KEY not found in environment variables');
  console.error('Make sure environment variables are set during build time');
}

let messaging: Messaging | null = null;

/**
 * Initialize Firebase Messaging
 * Must be called in browser environment only
 */
export const initializeMessaging = (): Messaging | null => {
  if (typeof window === 'undefined') {
    console.log('⚠️ Messaging cannot be initialized on server');
    return null;
  }

  try {
    if (!messaging) {
      messaging = getMessaging(app);
      console.log('✅ Firebase Messaging initialized');
    }
    return messaging;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Messaging:', error);
    return null;
  }
};

/**
 * Request notification permission and get FCM token
 * @returns FCM token or null
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      console.log('⚠️ Not in browser environment');
      return null;
    }

    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('⚠️ Browser does not support notifications');
      return null;
    }

    // Check current permission
    let permission = Notification.permission;

    // Request permission if not granted
    if (permission === 'default') {
      console.log('🔔 Requesting notification permission...');
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.log('❌ Notification permission denied');
      return null;
    }

    console.log('✅ Notification permission granted');

    // Initialize messaging
    const msg = initializeMessaging();
    if (!msg) {
      console.error('❌ Failed to initialize messaging');
      return null;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;
        console.log('✅ Service Worker ready');
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }

    // Validate VAPID key before attempting to get token
    if (!VAPID_KEY) {
      console.error('❌ Cannot get FCM token: VAPID key is missing');
      console.error('💡 NEXT_PUBLIC_VAPID_KEY was not set during build time');
      console.error('💡 Rebuild the application with environment variables present');
      return null;
    }

    // Get FCM token
    try {
      const token = await getToken(msg, { 
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.ready
      });
      
      if (token) {
        console.log('✅ FCM Token received:', token.substring(0, 20) + '...');
        return token;
      } else {
        console.log('❌ No FCM token received');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to get FCM token:', error);
      if (error instanceof Error && 'code' in error && error.code === 'messaging/failed-service-worker-registration') {
        console.error('Service worker registration failed. Make sure firebase-messaging-sw.js exists in public folder');
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Error in requestNotificationPermission:', error);
    return null;
  }
};

/**
 * Register FCM token with backend
 * @param token FCM token
 * @param userId User ID
 */
export const registerFCMToken = async (token: string, userId: string): Promise<boolean> => {
  try {
    // Log Firebase environment configuration
    console.log('%c🔔 FIREBASE MESSAGING REGISTRATION FLOW', 'background: #51cf66; color: white; padding: 8px; font-weight: bold;');
    console.log('✅ VAPID_KEY available:', VAPID_KEY || 'NOT SET');
    if (isDevClient()) {
      console.log('✅ VAPID_KEY from .env (NEXT_PUBLIC_VAPID_KEY):', process.env.NEXT_PUBLIC_VAPID_KEY || 'NOT SET');
    }
    
    const notificationServiceUrl = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 
      'https://extrahand-notification-service.apps.extrahand.in';
    
    if (isDevClient()) {
      console.log('🔔 Notification Service URL:', notificationServiceUrl);
      console.log('📍 Current page origin:', window.location.origin);
    }
    console.log('🔐 FCM Token:', token.substring(0, 20) + '...');
    
    // Get Firebase Auth token for authentication
    const { auth } = await import('@/lib/auth/firebase');
    const user = auth.currentUser;
    
    if (!user) {
      console.error('❌ No authenticated user');
      return false;
    }

    const idToken = await user.getIdToken();

    const fetchUrl = `${notificationServiceUrl}/api/v1/notifications/token`;
    console.log('📤 Making fetch request to:', fetchUrl);
    console.log('📝 Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken.substring(0, 20)}...`
    });

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        token,
        userId,
        platform: 'web',
        deviceId: generateDeviceId()
      })
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response statusText:', response.statusText);
    console.log('📨 Response headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
      'Content-Type': response.headers.get('Content-Type')
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to register FCM token:', response.statusText);
      console.error('❌ Error response:', errorText);
      return false;
    }

    console.log('✅ FCM token registered with backend');
    return true;
  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message);
    }
    return false;
  }
};

/**
 * Listen for foreground messages
 * @param callback Function to call when message received
 */
export const onForegroundMessage = (callback: (payload: MessagePayload) => void) => {
  const msg = initializeMessaging();
  if (!msg) {
    console.error('❌ Messaging not initialized');
    return () => {};
  }

  return onMessage(msg, (payload) => {
    console.log('📨 Foreground message received:', payload);
    callback(payload);
  });
};

/**
 * Generate a unique device ID for this browser
 */
const generateDeviceId = (): string => {
  // Check if device ID already exists in localStorage
  const stored = localStorage.getItem('fcm_device_id');
  if (stored) return stored;

  // Generate new device ID
  const deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('fcm_device_id', deviceId);
  return deviceId;
};

/**
 * Check if notifications are supported and enabled
 */
export const areNotificationsSupported = (): boolean => {
  return typeof window !== 'undefined' && 
         'Notification' in window && 
         'serviceWorker' in navigator;
};

/**
 * Get current notification permission status
 */
export const getNotificationPermissionStatus = (): NotificationPermission | null => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }
  return Notification.permission;
};

/**
 * ============================================================
 * POLLING-BASED NOTIFICATIONS (Fallback to FCM)
 * ============================================================
 */

import NotificationPollingService, { 
  InAppNotification 
} from '@/lib/notifications/pollingService';

/**
 * Initialize both FCM and polling notification systems
 * @param userId User ID for polling setup
 * @param pollingInterval Polling interval in milliseconds (default: 30000)
 */
export const initializeNotifications = async (
  userId: string,
  pollingInterval: number = 30000
): Promise<void> => {
  try {
    console.log('🔔 Initializing notification systems...');

    // Try FCM first
    const fcmAvailable = areNotificationsSupported();
    if (fcmAvailable) {
      console.log('✅ FCM is supported, attempting to enable...');
      const token = await requestNotificationPermission();
      
      if (token) {
        const registered = await registerFCMToken(token, userId);
        if (registered) {
          console.log('✅ FCM notifications enabled');
          // Set up foreground message listener
          onForegroundMessage((payload) => {
            console.log('📨 FCM message received:', payload);
            // The message will be handled by the service worker for background
          });
        }
      }
    }

    // Polling disabled for now
    // NotificationPollingService.initialize({ ... });
    // NotificationPollingService.startPolling(userId, pollingInterval);
    console.log('✅ Notification systems initialized (polling disabled)');
  } catch (error) {
    console.error('❌ Error initializing notifications:', error);
  }
};

/**
 * Stop all notification systems
 */
export const stopNotifications = (): void => {
  try {
    console.log('⏹️ Stopping notification systems...');
    NotificationPollingService.stopPolling();
    console.log('✅ Notification systems stopped');
  } catch (error) {
    console.error('❌ Error stopping notifications:', error);
  }
};

/**
 * Get notifications via polling/in-app API
 * @param limit Number of notifications to fetch
 * @param skip Number of notifications to skip (for pagination)
 * @param unreadOnly Fetch only unread notifications
 */
export const getInAppNotifications = async (
  limit: number = 50,
  skip: number = 0,
  unreadOnly: boolean = true
): Promise<InAppNotification[]> => {
  try {
    const notifications = await NotificationPollingService.fetchNotifications(
      '', // userId handled by API
      limit,
      skip,
      unreadOnly
    );
    return notifications || [];
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    return [];
  }
};

/**
 * Mark notification as read
 * @param notificationId Notification ID
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    return await NotificationPollingService.markAsRead(notificationId);
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    return false;
  }
};

/**
 * Delete notification
 * @param notificationId Notification ID
 */
export const deleteInAppNotification = async (notificationId: string): Promise<boolean> => {
  try {
    return await NotificationPollingService.deleteNotification(notificationId);
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    return false;
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    return await NotificationPollingService.getUnreadCount();
  } catch (error) {
    console.error('❌ Error fetching unread count:', error);
    return 0;
  }
};

/**
 * Send a test notification (for debugging)
 */
export const sendTestNotification = (): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Test Notification', {
      body: 'This is a test notification from ExtraHand',
      icon: '/logo.webp'
    });
  } else {
    console.warn('⚠️ Notifications not available or permission denied');
  }
};
