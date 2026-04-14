import type { Subcategory } from "@/types/category";

/**
 * Sub slug as used in legacy /services/[slug]/[subcategory] paths (strips duplicated parent prefix).
 */
export function getSubcategorySlugForRoute(
   categorySlug: string,
   subcategorySlug?: string
): string {
   const normalized = (subcategorySlug || "").trim();
   if (!normalized) return "";
   const prefix = `${categorySlug}/`;
   return normalized.startsWith(prefix)
      ? normalized.slice(prefix.length)
      : normalized;
}

/** After mergeCarCategories, subs may belong to a different parent than the merged row */
export function getParentCategorySlugForSub(
   category: Pick<{ slug: string }, "slug">,
   sub: Subcategory & { categoryPageSlug?: string }
): string {
   return sub.categoryPageSlug || sub.categorySlug || category.slug || "";
}

/**
 * Stable HTML id for a sub-service section (must match header /services/[slug]#[id] links).
 */
export function subcategorySectionAnchorId(
   categorySlug: string,
   rawSubSlug: string
): string {
   const routeSub = getSubcategorySlugForRoute(categorySlug, rawSubSlug);
   const safe = routeSub
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
   return safe ? `sub-${safe}` : "sub-item";
}
