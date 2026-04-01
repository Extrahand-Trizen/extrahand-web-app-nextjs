/**
 * Public redirect page: DigiLocker (Cashfree) redirects here after Aadhaar verification.
 * Cashfree requires redirect_url to start with https, so we use this HTTPS page
 * and immediately redirect to the mobile app using the custom scheme deep link.
 * Android/iOS both rely on the app's intent-filter / URL handling for extrahand:// links.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

const APP_DEEP_LINK = "extrahand://verify/aadhaar/callback";

export default function OpenAppAadhaarCallbackPage() {
  const [attempted, setAttempted] = useState(false);
  const [openError, setOpenError] = useState<string | null>(null);

  const isAndroid = useMemo(
    () => typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent),
    []
  );

  const openInChrome = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("viaChrome") !== "1") {
      url.searchParams.set("viaChrome", "1");
    }
    const hostAndPath = `${url.host}${url.pathname}${url.search}`;
    const chromeIntent = `intent://${hostAndPath}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = chromeIntent;
  };

  const tryOpenApp = (fromUserClick = false) => {
    try {
      setOpenError(null);
      setAttempted(true);

      // 1) Try standard deep link first.
      window.location.assign(APP_DEEP_LINK);

      // 2) Some Android webviews block direct navigation but allow iframe-based scheme triggers.
      if (isAndroid) {
        window.setTimeout(() => {
          if (document.visibilityState === "hidden") return;
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = APP_DEEP_LINK;
          document.body.appendChild(iframe);
          window.setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1200);
        }, fromUserClick ? 300 : 600);
      }
    } catch {
      setOpenError("Could not trigger app open. Please use the button below to retry.");
    }
  };

  useEffect(() => {
    // Try automatic redirect to the app; may be blocked by some browsers/webviews,
    // in which case the user can tap the button below.
    tryOpenApp(false);
    // On Android in-app browsers, scheme links are often blocked.
    // If app did not open, move to Chrome and retry from there.
    if (isAndroid) {
      const timeout = window.setTimeout(() => {
        if (document.visibilityState === "hidden") return;
        const url = new URL(window.location.href);
        if (url.searchParams.get("viaChrome") === "1") return;
        openInChrome();
      }, 1800);
      return () => window.clearTimeout(timeout);
    }
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
      {isAndroid && (
        <button
          type="button"
          onClick={openInChrome}
          className="mt-3 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          Open this page in Chrome
        </button>
      )}
      <a
        href={APP_DEEP_LINK}
        className="mt-3 text-sm text-amber-700 underline"
      >
        Open using deep link
      </a>
      {attempted && !openError && (
        <p className="mt-4 text-xs text-gray-500 text-center max-w-xs">
          If nothing happens, open this page in Chrome/Safari and tap the button again.
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
