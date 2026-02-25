/**
 * Environment Variables Logger
 * This file logs environment variables immediately on import (before React hydration)
 * Import this at the top of your layout or app component
 */

export function logEnvironmentVariables() {
  // Log immediately - this will show in console as soon as JavaScript loads
  if (typeof window !== 'undefined') {
    const timestamp = new Date().toLocaleTimeString();
    
    console.log('%c\n╔════════════════════════════════════════════════════════╗', 'color: #00ff00; font-weight: bold; font-size: 12px;');
    console.log('%c║  🌍 EXTRAHAND APP ENVIRONMENT VARIABLES  [' + timestamp + ']  ║', 'color: #00ff00; font-weight: bold; font-size: 12px;');
    console.log('%c╠════════════════════════════════════════════════════════╣', 'color: #00ff00; font-weight: bold; font-size: 12px;');
    
    // Service URLs
    console.log('%c║ 🔗 SERVICE URLS:', 'color: #00ff00; font-weight: bold;');
    console.log('%c║   NEXT_PUBLIC_API_BASE_URL:', 'color: #ffff00;', process.env.NEXT_PUBLIC_API_BASE_URL || '❌ NOT SET');
    console.log('%c║   NEXT_PUBLIC_NOTIFICATION_SERVICE_URL:', 'color: #ffff00;', process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || '❌ NOT SET');
    console.log('%c║   NEXT_PUBLIC_TASK_SERVICE_URL:', 'color: #ffff00;', process.env.NEXT_PUBLIC_TASK_SERVICE_URL || '❌ NOT SET');
    console.log('%c║   NEXT_PUBLIC_CHAT_SERVICE_URL:', 'color: #ffff00;', process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || '❌ NOT SET');
    console.log('%c║   NEXT_PUBLIC_CONTENT_ADMIN_URL:', 'color: #ffff00;', process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL || '❌ NOT SET');
    
    // Firebase Config
    console.log('%c║\n║ 🔥 FIREBASE CONFIGURATION:', 'color: #ffa500; font-weight: bold;');
    console.log('%c║   NEXT_PUBLIC_FIREBASE_PROJECT_ID:', 'color: #ffff00;', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ NOT SET');
    console.log('%c║   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', 'color: #ffff00;', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ NOT SET');
    console.log('%c║   NEXT_PUBLIC_FIREBASE_APP_ID:', 'color: #ffff00;', process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '❌ NOT SET');
    console.log('%c║   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', 'color: #ffff00;', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '❌ NOT SET');
    
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
    console.log('%c║   NEXT_PUBLIC_VAPID_KEY:', 'color: #ffff00;', 
      vapidKey ? '✅ SET (' + vapidKey+ '...)' : '❌ NOT SET');
    
    // Page Info
    console.log('%c║\n║ 📍 CURRENT PAGE:', 'color: #00ccff; font-weight: bold;');
    console.log('%c║   Origin:', 'color: #ffff00;', window.location.origin);
    console.log('%c║   Host:', 'color: #ffff00;', window.location.host);
    console.log('%c║   Protocol:', 'color: #ffff00;', window.location.protocol);
    
    console.log('%c╚════════════════════════════════════════════════════════╝\n', 'color: #00ff00; font-weight: bold; font-size: 12px;');
  }
}

// Call immediately on import
logEnvironmentVariables();
