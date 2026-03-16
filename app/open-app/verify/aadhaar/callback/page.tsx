/**
 * Public redirect page: DigiLocker (Cashfree) redirects here after Aadhaar verification.
 * Cashfree requires redirect_url to start with https, so we use this HTTPS page
 * and immediately redirect to the mobile app using the custom scheme deep link.
 * Android/iOS both rely on the app's intent-filter / URL handling for extrahand:// links.
 */

"use client";

import React, { useEffect } from "react";

const APP_DEEP_LINK = "extrahand://verify/aadhaar/callback";

export default function OpenAppAadhaarCallbackPage() {
  useEffect(() => {
    try {
      // Try automatic redirect to the app; may be blocked by some browsers,
      // in which case the user can tap the button below.
      window.location.href = APP_DEEP_LINK;
    } catch {
      // Ignore; fallback button is available.
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <p className="text-gray-600 text-center mb-6">
        Opening ExtraHand app…
      </p>
      <a
        href={APP_DEEP_LINK}
        className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg no-underline hover:bg-amber-600 active:bg-amber-700"
      >
        Open ExtraHand app
      </a>
      <p className="mt-6 text-sm text-gray-500 text-center max-w-xs">
        If the app does not open automatically, tap the button above or open the ExtraHand app from your app drawer.
      </p>
    </div>
  );
}
