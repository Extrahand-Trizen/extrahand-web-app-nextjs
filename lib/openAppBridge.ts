export const APP_SCHEME = "extrahand";
export const ANDROID_PACKAGE = "com.extrahand";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.extrahand";
export const APP_STORE_URL =
  "https://apps.apple.com/in/app/extrahands/id6768239211";

const MONGO_ID_RE = /^[a-f0-9]{24}$/i;

export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function getStoreFallbackUrl(): string {
  if (isIOSDevice()) return APP_STORE_URL;
  if (isAndroidDevice()) return PLAY_STORE_URL;
  return PLAY_STORE_URL;
}

export function openAppOrStore(path = ""): void {
  if (typeof window === "undefined") return;

  const deepLink = buildAppDeepLink(path);
  window.location.href = deepLink;

  window.setTimeout(() => {
    if (document.visibilityState === "hidden") return;

    const fallback = getStoreFallbackUrl();
    window.location.assign(fallback);
  }, 1500);
}

/** Public HTTPS bridge used in WhatsApp template buttons. */
export const WHATSAPP_TASK_OPEN_BRIDGE_BASE = "https://extrahand.in/open/tasks";

export function isValidTaskId(taskId: string): boolean {
  return MONGO_ID_RE.test(String(taskId || "").trim());
}

export function buildAppDeepLink(path: string): string {
  const normalized = path.replace(/^\/+/, "");
  return `${APP_SCHEME}://${normalized}`;
}

export function buildTaskOpenDeepLink(taskId: string, track = false): string {
  const id = encodeURIComponent(taskId.trim());
  return track
    ? buildAppDeepLink(`tasks/${id}/track`)
    : buildAppDeepLink(`tasks/${id}`);
}

export function buildWhatsAppTaskBridgeUrl(taskId: string, track = false): string {
  const id = encodeURIComponent(taskId.trim());
  return track
    ? `${WHATSAPP_TASK_OPEN_BRIDGE_BASE}/${id}/track`
    : `${WHATSAPP_TASK_OPEN_BRIDGE_BASE}/${id}`;
}
