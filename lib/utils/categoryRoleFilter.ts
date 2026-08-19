import type { CategoriesListItem } from "@/lib/api/endpoints/categories";

/** Normalize CMS categoryType values such as "As A Tasker" / "As A Poster". */
export function normalizeCategoryType(categoryType?: string): string {
   return (categoryType || "").trim().toLowerCase();
}

/**
 * Whether a category belongs on tasker (jobs) or poster (services) surfaces.
 * Empty categoryType is treated as shared/both (legacy CMS rows).
 */
export function categoryMatchesRole(
   categoryType: string | undefined,
   role: "tasker" | "poster"
): boolean {
   const type = normalizeCategoryType(categoryType);
   if (!type) return true;
   if (type.includes("both")) return true;

   if (role === "tasker") {
      return type.includes("tasker") || type.includes("helper");
   }

   return type.includes("poster");
}

export function filterCategoriesByRole<T extends Pick<CategoriesListItem, "categoryType">>(
   categories: T[],
   role: "tasker" | "poster"
): T[] {
   return categories.filter((cat) => categoryMatchesRole(cat.categoryType, role));
}
