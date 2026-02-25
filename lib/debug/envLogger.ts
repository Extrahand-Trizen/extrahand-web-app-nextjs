import { isDevClient } from '@/lib/config';

/**
 * Environment Variables Logger
 * Logs PUBLIC environment variables for debugging (dev-only)
 */
export const logEnvironmentVariables = () => {
  if (typeof window === 'undefined' || !isDevClient()) {
    return;
  }

  console.log('%c=== 🌍 EXTRAHAND APP ENVIRONMENT VARIABLES ===', 'background: #1e90ff; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
  
  // API & Services
  console.group('🔗 Service URLs');
  console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL || '❌ NOT SET');
  console.log('NEXT_PUBLIC_NOTIFICATION_SERVICE_URL:', process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || '❌ NOT SET');
  console.log('NEXT_PUBLIC_TASK_SERVICE_URL:', process.env.NEXT_PUBLIC_TASK_SERVICE_URL || '❌ NOT SET');
  console.log('NEXT_PUBLIC_CHAT_SERVICE_URL:', process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || '❌ NOT SET');
  console.log('NEXT_PUBLIC_CONTENT_ADMIN_URL:', process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL || '❌ NOT SET');
  console.groupEnd();

  // Firebase
  console.group('🔥 Firebase Configuration');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ NOT SET');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ NOT SET');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '❌ NOT SET');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '❌ NOT SET');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '❌ NOT SET');
  console.log('NEXT_PUBLIC_VAPID_KEY:', process.env.NEXT_PUBLIC_VAPID_KEY ? '✅ Set (' + process.env.NEXT_PUBLIC_VAPID_KEY.substring(0, 20) + '...)' : '❌ NOT SET');
  console.groupEnd();

  // Page Info
  console.group('📍 Current Page');
  console.log('Origin:', window.location.origin);
  console.log('Host:', window.location.host);
  console.log('Protocol:', window.location.protocol);
  console.groupEnd();

  console.log('%c===========================================', 'background: #1e90ff; color: white; padding: 5px 10px; border-radius: 3px;');
};

// Do not auto-log in production; keep this as a manual dev helper
