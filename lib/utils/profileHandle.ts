export function slugifyName(input: string): string {
  const raw = (input || "").trim().toLowerCase();
  if (!raw) return "user";

  // Keep letters/numbers/spaces/hyphens; drop other punctuation.
  const cleaned = raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const dashed = cleaned.replace(/\s/g, "-").replace(/-+/g, "-");
  return dashed || "user";
}

const FIREBASE_UID_RE = /^[A-Za-z0-9]{28}$/;
const MONGO_ID_RE = /^[a-f0-9]{24}$/i;

export function looksLikeUserId(value: string): boolean {
  return FIREBASE_UID_RE.test(value) || MONGO_ID_RE.test(value);
}

/**
 * Collision-free public handle.
 * We append the stable user id so the URL is always unique.
 *
 * Example: "tarun-abc-d3qVCkzgCvUGAl0yUUngiflvX793"
 */
export function buildPublicProfileHandle(name: string | undefined | null, userId: string): string {
  const base = slugifyName(name || "");
  return `${base}-${userId}`;
}

/**
 * Accepts either:
 * - raw id: d3qVCkzgCvUGAl0yUUngiflvX793
 * - handle: tarun-abc-d3qVCkzgCvUGAl0yUUngiflvX793
 */
export function parsePublicProfileHandle(handleOrId: string): { userId: string; slug: string | null } {
  const value = (handleOrId || "").trim();
  if (!value) return { userId: "", slug: null };

  if (looksLikeUserId(value)) return { userId: value, slug: null };

  const parts = value.split("-").filter(Boolean);
  if (parts.length < 2) return { userId: value, slug: null };

  const maybeId = parts[parts.length - 1] || "";
  if (!looksLikeUserId(maybeId)) return { userId: value, slug: null };

  const slug = parts.slice(0, -1).join("-");
  return { userId: maybeId, slug: slug || null };
}

export function buildPublicProfilePath(name: string | undefined | null, userId: string): string {
  if (!userId) return "/profile";
  const handle = name ? buildPublicProfileHandle(name, userId) : userId;
  return `/profile/${handle}`;
}

