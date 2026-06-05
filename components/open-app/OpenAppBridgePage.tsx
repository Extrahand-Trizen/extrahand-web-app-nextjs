"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PLAY_STORE_URL } from "@/lib/openAppBridge";

type OpenAppBridgePageProps = {
  appDeepLink: string;
  headline?: string;
};

export function OpenAppBridgePage({
  appDeepLink,
  headline = "Opening ExtraHand…",
}: OpenAppBridgePageProps) {
  const [showFallback, setShowFallback] = useState(false);

  const isAndroid = useMemo(
    () => typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const openApp = () => {
      window.location.assign(appDeepLink);
      if (isAndroid) {
        window.setTimeout(() => {
          if (document.visibilityState === "hidden") return;
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = appDeepLink;
          document.body.appendChild(iframe);
          window.setTimeout(() => document.body.removeChild(iframe), 1200);
        }, 400);
      }
    };

    openApp();

    let chromeTimer: number | undefined;
    if (isAndroid) {
      chromeTimer = window.setTimeout(() => {
        if (document.visibilityState === "hidden") return;
        const url = new URL(window.location.href);
        if (url.searchParams.get("viaChrome") === "1") return;
        url.searchParams.set("viaChrome", "1");
        const hostAndPath = `${url.host}${url.pathname}${url.search}`;
        window.location.href = `intent://${hostAndPath}#Intent;scheme=https;package=com.android.chrome;end`;
      }, 1200);
    }

    const storeTimer = window.setTimeout(() => {
      if (document.visibilityState === "hidden") return;
      window.location.assign(PLAY_STORE_URL);
    }, 3500);

    const fallbackTimer = window.setTimeout(() => {
      if (document.visibilityState === "hidden") return;
      setShowFallback(true);
    }, 4000);

    return () => {
      if (chromeTimer) window.clearTimeout(chromeTimer);
      window.clearTimeout(storeTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [appDeepLink, isAndroid]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div
        className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mb-4"
        aria-hidden
      />
      <p className="text-gray-700 text-center text-sm">{headline}</p>
      {showFallback && (
        <a
          href={appDeepLink}
          className="mt-6 text-sm text-amber-600 underline"
        >
          Tap here to open ExtraHand
        </a>
      )}
    </div>
  );
}
