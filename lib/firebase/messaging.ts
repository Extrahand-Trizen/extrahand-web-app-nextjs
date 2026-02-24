/**
 * Firebase Cloud Messaging Utilities
 * Handles FCM token registration and foreground message listening
 */

import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';
import { app } from '@/lib/auth/firebase';

// VAPID key for web push (should match your Firebase Console settings)
// This is a public key and safe to expose
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 
  'BKYxabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Placeholder

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
    const notificationServiceUrl = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 
      'https://extrahandnotificationservice.llp.trizenventures.com';
    
    // Get Firebase Auth token for authentication
    const { auth } = await import('@/lib/auth/firebase');
    const user = auth.currentUser;
    
    if (!user) {
      console.error('❌ No authenticated user');
      return false;
    }

    const idToken = await user.getIdToken();

    const response = await fetch(`${notificationServiceUrl}/api/v1/notifications/token`, {
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

    if (!response.ok) {
      console.error('❌ Failed to register FCM token:', response.statusText);
      return false;
    }

    console.log('✅ FCM token registered with backend');
    return true;
  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
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
