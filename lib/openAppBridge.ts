export const APP_SCHEME = "extrahand";
export const ANDROID_PACKAGE = "com.extrahand";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.extrahand";

const MONGO_ID_RE = /^[a-f0-9]{24}$/i;

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
