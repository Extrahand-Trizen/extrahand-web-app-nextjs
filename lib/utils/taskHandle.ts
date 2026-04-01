import { slugifyName } from "@/lib/utils/profileHandle";

const MONGO_ID_RE = /^[a-f0-9]{24}$/i;

export function looksLikeTaskId(value: string): boolean {
  return MONGO_ID_RE.test(value);
}

/**
 * Collision-free task handle.
 * We append the stable task id so the URL is always unique.
 *
 * Example: "chair-repair-69cbe3865e3433ac421baf7a"
 */
export function buildPublicTaskHandle(
  title: string | undefined | null,
  taskId: string
): string {
  const base = slugifyName(title || "").replace(/^user$/, "task");
  return `${base}-${taskId}`;
}

/**
 * Accepts either:
 * - raw id: 69cbe3865e3433ac421baf7a
 * - handle: chair-repair-69cbe3865e3433ac421baf7a
 */
export function parsePublicTaskHandle(
  handleOrId: string
): { taskId: string; slug: string | null } {
  const value = (handleOrId || "").trim();
  if (!value) return { taskId: "", slug: null };

  if (looksLikeTaskId(value)) return { taskId: value, slug: null };

  const parts = value.split("-").filter(Boolean);
  if (parts.length < 2) return { taskId: value, slug: null };

  const maybeId = parts[parts.length - 1] || "";
  if (!looksLikeTaskId(maybeId)) return { taskId: value, slug: null };

  const slug = parts.slice(0, -1).join("-");
  return { taskId: maybeId, slug: slug || null };
}

export function buildPublicTaskPath(
  title: string | undefined | null,
  taskId: string
): string {
  if (!taskId) return "/tasks";
  const handle = title ? buildPublicTaskHandle(title, taskId) : taskId;
  return `/tasks/${handle}`;
}

