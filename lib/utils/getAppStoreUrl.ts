/**
 * Thin wrapper around openAppBridge to detect the user's device and
 * redirect them to the correct app store for ExtraHand.
 *
 * Uses the canonical URLs and detection helpers already defined in openAppBridge:
 *   - Android → https://play.google.com/store/apps/details?id=com.extrahand
 *   - iOS     → https://apps.apple.com/in/app/extrahands/id6768239211
 *   - Unknown → Play Store (fallback)
 */

import {
  PLAY_STORE_URL,
  APP_STORE_URL,
  isIOSDevice,
  isAndroidDevice,
} from "@/lib/openAppBridge";

export function getAppStoreUrl(): string {
  if (typeof window === "undefined") {
    // Server-side: default to Play Store
    return PLAY_STORE_URL;
  }

  if (isIOSDevice()) return APP_STORE_URL;
  if (isAndroidDevice()) return PLAY_STORE_URL;

  // Fallback for desktop / unknown devices → Play Store
  return PLAY_STORE_URL;
}

/**
 * Detects the user's device and opens the appropriate app store link.
 * - Mobile: same tab (lets the OS intercept the link natively)
 * - Desktop: new tab so the user doesn't leave the page
 */
export function redirectToAppStore(): void {
  if (typeof window === "undefined") return;

  const url = getAppStoreUrl();
  const isMobile = isIOSDevice() || isAndroidDevice();

  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
