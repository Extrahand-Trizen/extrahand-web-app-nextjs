/**
 * Public redirect page: DigiLocker (Cashfree) redirects here after Aadhaar verification.
 * Cashfree requires redirect_url to start with https, so we use this HTTPS page
 * and redirect to the mobile app. Uses Android intent URL on Android for reliable
 * app opening from Chrome; custom scheme on iOS/other.
 */

"use client";

import React, { useEffect, useState } from "react";

const APP_DEEP_LINK = "extrahand://verify/aadhaar/callback";
const ANDROID_PACKAGE = "com.extrahand";
// Android intent URL – opens app by package name (works reliably from Chrome)
const ANDROID_INTENT_URL = `intent://verify/aadhaar/callback#Intent;scheme=extrahand;package=${ANDROID_PACKAGE};end`;

function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

function getOpenAppUrl() {
  return isAndroid() ? ANDROID_INTENT_URL : APP_DEEP_LINK;
}

export default function OpenAppAadhaarCallbackPage() {
  const [didRedirect, setDidRedirect] = useState(false);
  const openAppUrl = getOpenAppUrl();

  useEffect(() => {
    if (didRedirect) return;
    setDidRedirect(true);
    // Try redirect; may be blocked by browser on custom scheme – user can tap the button
    try {
      window.location.replace(openAppUrl);
    } catch {
      window.location.href = openAppUrl;
    }
  }, [didRedirect, openAppUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <p className="text-gray-600 text-center mb-6">
        Opening ExtraHand app…
      </p>
      <a
        href={openAppUrl}
        className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg no-underline hover:bg-amber-600 active:bg-amber-700"
      >
        Open ExtraHand app
      </a>
      <p className="mt-6 text-sm text-gray-500 text-center max-w-xs">
        If the app does not open, tap the button above or open the ExtraHand app from your app drawer.
      </p>
    </div>
  );
}
