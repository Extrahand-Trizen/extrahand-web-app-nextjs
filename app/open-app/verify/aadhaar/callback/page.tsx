/**
 * Public redirect page: DigiLocker (Cashfree) redirects here after Aadhaar verification.
 * Cashfree requires redirect_url to start with https, so we use this HTTPS page
 * and immediately redirect to the mobile app using the custom scheme deep link.
 * Android/iOS both rely on the app's intent-filter / URL handling for extrahand:// links.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

const APP_DEEP_LINK = "extrahand://verify/aadhaar/callback";
const ANDROID_INTENT_LINK =
  "intent://verify/aadhaar/callback#Intent;scheme=extrahand;package=com.extrahand;end";

export default function OpenAppAadhaarCallbackPage() {
  const [attempted, setAttempted] = useState(false);
  const [openError, setOpenError] = useState<string | null>(null);

  const isAndroid = useMemo(
    () => typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent),
    []
  );

  const tryOpenApp = (fromUserClick = false) => {
    try {
      setOpenError(null);
      setAttempted(true);

      // 1) Try standard deep link first.
      window.location.href = APP_DEEP_LINK;

      // 2) On Android, some webviews/browsers need intent:// fallback.
      if (isAndroid) {
        window.setTimeout(() => {
          window.location.href = ANDROID_INTENT_LINK;
        }, fromUserClick ? 120 : 280);
      }
    } catch {
      setOpenError("Could not trigger app open. Please use the button below to retry.");
    }
  };

  useEffect(() => {
    // Try automatic redirect to the app; may be blocked by some browsers/webviews,
    // in which case the user can tap the button below.
    tryOpenApp(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <p className="text-gray-600 text-center mb-6">
        Opening ExtraHand app…
      </p>
      <button
        type="button"
        onClick={() => tryOpenApp(true)}
        className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 active:bg-amber-700"
      >
        Open ExtraHand app
      </button>
      <a
        href={APP_DEEP_LINK}
        className="mt-3 text-sm text-amber-700 underline"
      >
        Open using deep link
      </a>
      {attempted && !openError && (
        <p className="mt-4 text-xs text-gray-500 text-center max-w-xs">
          If nothing happens, switch to your browser (Chrome/Safari) and tap the button again.
        </p>
      )}
      {openError && (
        <p className="mt-4 text-xs text-red-600 text-center max-w-xs">{openError}</p>
      )}
      <p className="mt-6 text-sm text-gray-500 text-center max-w-xs">
        If the app does not open automatically, tap the button above or open the ExtraHand app from your app drawer.
      </p>
    </div>
  );
}
