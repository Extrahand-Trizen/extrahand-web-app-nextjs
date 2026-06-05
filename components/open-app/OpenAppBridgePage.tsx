"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ANDROID_PACKAGE, PLAY_STORE_URL } from "@/lib/openAppBridge";

type OpenAppBridgePageProps = {
  appDeepLink: string;
  headline?: string;
};

export function OpenAppBridgePage({
  appDeepLink,
  headline = "Opening ExtraHand app…",
}: OpenAppBridgePageProps) {
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
      window.location.assign(appDeepLink);

      if (isAndroid) {
        window.setTimeout(() => {
          if (document.visibilityState === "hidden") return;
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = appDeepLink;
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
    tryOpenApp(false);
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
  }, [appDeepLink]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fallback = window.setTimeout(() => {
      if (document.visibilityState === "hidden") return;
      window.location.assign(PLAY_STORE_URL);
    }, 4500);
    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <p className="text-gray-600 text-center mb-6">{headline}</p>
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
      <a href={appDeepLink} className="mt-3 text-sm text-amber-700 underline">
        Open using deep link
      </a>
      <a
        href={PLAY_STORE_URL}
        className="mt-4 text-sm text-gray-600 underline"
      >
        Get the app on Google Play
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
        Package: {ANDROID_PACKAGE}
      </p>
    </div>
  );
}
