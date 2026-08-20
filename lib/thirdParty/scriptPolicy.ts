/**
 * Route-aware third-party script policy.
 *
 * Marketing/SEO pages should not pay the cost of app-only analytics or
 * booking tooling. App and conversion routes keep full instrumentation.
 */

export type ScriptTier = "marketing" | "conversion" | "app";

const APP_ROUTE_PATTERN =
   /^\/(dashboard|tasks|profile|chat|home|poster|onboarding|notifications|payments)(\/|$)/;

const CONVERSION_ROUTE_PATTERN =
   /^\/(login|signup|otp-verification|auth|discover|tasks\/new)(\/|$)/;

/** Firebase Auth iframe + listener — not needed on guest marketing pages. */
const FIREBASE_AUTH_ROUTE_PATTERN =
   /^\/(login|signup|otp-verification|auth)(\/|$)/;

const PROTECTED_ROUTE_PATTERN =
   /^\/(dashboard|tasks|profile|chat|notifications|payments|poster|onboarding|home)(\/|$)/;

export function getScriptTier(pathname: string): ScriptTier {
   if (APP_ROUTE_PATTERN.test(pathname)) return "app";
   if (CONVERSION_ROUTE_PATTERN.test(pathname)) return "conversion";
   return "marketing";
}

export function shouldLoadGa4(_pathname: string): boolean {
   // GA4 covers SEO traffic measurement; always allowed after cookie consent.
   return true;
}

/** Mixpanel is for product funnels — skip pure SEO landings until user enters app flow. */
export function shouldLoadMixpanel(pathname: string): boolean {
   return getScriptTier(pathname) !== "marketing";
}

export function getGa4IdleTimeoutMs(pathname: string): number {
   return getScriptTier(pathname) === "marketing" ? 12_000 : 4_000;
}

export function getMixpanelIdleTimeoutMs(pathname: string): number {
   const tier = getScriptTier(pathname);
   if (tier === "marketing") return 12_000;
   if (tier === "conversion") return 4_000;
   return 2_000;
}

export function isFirebaseAuthRoute(pathname: string): boolean {
   return FIREBASE_AUTH_ROUTE_PATTERN.test(pathname);
}

export function shouldAttachFirebaseAuth(pathname: string): boolean {
   if (isFirebaseAuthRoute(pathname)) return true;
   if (typeof document === "undefined") return false;
   return document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("extrahand_auth=1"));
}

export function shouldLoadOtpPollingBridge(pathname: string): boolean {
   if (PROTECTED_ROUTE_PATTERN.test(pathname)) return true;
   if (typeof document === "undefined") return false;
   return document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("extrahand_auth=1"));
}

export function scheduleWhenIdle(
   callback: () => void,
   timeoutMs: number
): () => void {
   if (typeof window === "undefined") return () => {};

   if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(callback, { timeout: timeoutMs });
      return () => window.cancelIdleCallback(id);
   }

   const id = window.setTimeout(callback, Math.min(timeoutMs, 8_000));
   return () => window.clearTimeout(id);
}
