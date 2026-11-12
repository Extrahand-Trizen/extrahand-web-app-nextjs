import { categoriesApi } from "@/lib/api/endpoints/categories";
import {
   categoryMatchesRole,
   filterCategoriesByRole,
} from "@/lib/utils/categoryRoleFilter";
import type { Subcategory } from "@/types/category";
import {
   isAllowedPublicCategorySlug,
   PUBLIC_CATEGORY_SLUGS,
} from "@/lib/data/public-category-allowlist";

function getSubcategoryRouteSegment(sub: Subcategory): string {
   const slug = (sub.slug || "").trim();
   if (!slug) return "";
   if (slug.includes("/")) {
      const segments = slug.split("/").filter(Boolean);
      return segments[segments.length - 1] || slug;
   }
   return slug;
}

function buildSubcategoryStaticParams(
   role: "tasker" | "poster",
   allSubs: Subcategory[],
   publishedCategoryTypes: Map<string, string | undefined>
): { slug: string; subcategory: string }[] {
   const params: { slug: string; subcategory: string }[] = [];
   const seen = new Set<string>();

   for (const sub of allSubs) {
      const parentSlug = (sub.categorySlug || "").trim();
      if (!parentSlug || !isAllowedPublicCategorySlug(parentSlug)) continue;

      const routeSubcategory = getSubcategoryRouteSegment(sub);
      if (!routeSubcategory) continue;

      const parentType = publishedCategoryTypes.get(parentSlug);
      if (role === "poster" && parentType !== undefined) {
         if (!categoryMatchesRole(parentType, role)) continue;
      }

      const key = `${parentSlug}/${routeSubcategory}`;
      if (seen.has(key)) continue;
      seen.add(key);
      params.push({ slug: parentSlug, subcategory: routeSubcategory });
   }

   return params;
}

/** Static params for /jobs/[slug] from the public category allowlist. */
export async function getJobCategoryStaticParams(): Promise<{ slug: string }[]> {
   try {
      const categories = await categoriesApi.getCategoriesBySlugs(
         PUBLIC_CATEGORY_SLUGS,
         { includeUnpublished: false }
      );
      const seen = new Set<string>();

      return categories
         .filter(({ slug }) => {
            if (!slug || !isAllowedPublicCategorySlug(slug) || seen.has(slug)) return false;
            seen.add(slug);
            return true;
         })
         .map(({ slug }) => ({ slug }));
   } catch (error) {
      console.error("Failed to build job category static params:", error);
      return [{ slug: "_" }];
   }
}

/** Slugs for /services/[slug] — published categories in the public allowlist. */
export async function getServiceCategoryStaticParams(): Promise<{ slug: string }[]> {
   try {
      const categories = await categoriesApi.getCategoriesBySlugs(
         PUBLIC_CATEGORY_SLUGS,
         { includeUnpublished: false }
      );
      const posterCategories = filterCategoriesByRole(categories, "poster");
      const seen = new Set<string>();

      const params = posterCategories
         .filter(({ slug }) => {
            if (!slug || !isAllowedPublicCategorySlug(slug) || seen.has(slug)) return false;
            seen.add(slug);
            return true;
         })
         .map(({ slug }) => ({ slug }));

      return params.length > 0 ? params : [{ slug: "_" }];
   } catch (error) {
      console.error("Failed to build service category static params:", error);
      return [{ slug: "_" }];
   }
}

/** Params for /jobs/[slug]/[subcategory] and /services/[slug]/[subcategory]. */
export async function getSubcategoryStaticParams(
   role: "tasker" | "poster"
): Promise<{ slug: string; subcategory: string }[]> {
   try {
      const categories = await categoriesApi.getCategoriesBySlugs(
         PUBLIC_CATEGORY_SLUGS,
         { includeUnpublished: false }
      );
      const roleCategories =
         role === "tasker" ? categories : filterCategoriesByRole(categories, role);
      const allSubs = (
         await Promise.all(
            roleCategories.map((category) =>
               Array.isArray(category.subcategories) &&
               category.subcategories.length > 0
                  ? category.subcategories
                  : categoriesApi.getSubcategories(category.slug)
            )
         )
      ).flat();

      const publishedCategoryTypes = new Map(
         categories.map((cat) => [cat.slug, cat.categoryType])
      );

      const params = buildSubcategoryStaticParams(
         role,
         allSubs,
         publishedCategoryTypes
      );

      return params.length > 0 ? params : [{ slug: "_", subcategory: "_" }];
   } catch (error) {
      console.error("Failed to build subcategory static params:", error);
      return [{ slug: "_", subcategory: "_" }];
   }
}

/** Params for /task/[...slug] (tasker job pages) in the public allowlist. */
export async function getTaskCatchAllStaticParams(): Promise<{ slug: string[] }[]> {
   try {
      const categories = await categoriesApi.getCategoriesBySlugs(
         PUBLIC_CATEGORY_SLUGS,
         { includeUnpublished: false }
      );
      const jobCategories = categories;
      const allSubs = (
         await Promise.all(
            jobCategories.map((category) =>
               Array.isArray(category.subcategories) &&
               category.subcategories.length > 0
                  ? category.subcategories
                  : categoriesApi.getSubcategories(category.slug)
            )
         )
      ).flat();
      const publishedCategoryTypes = new Map(
         categories.map((cat) => [cat.slug, cat.categoryType])
      );
      const params: { slug: string[] }[] = [];
      const seen = new Set<string>();

      for (const cat of jobCategories) {
         if (!cat.slug || !isAllowedPublicCategorySlug(cat.slug)) continue;

         if (!seen.has(cat.slug)) {
            seen.add(cat.slug);
            params.push({ slug: [cat.slug] });
         }
      }

      const taskerSubParams = buildSubcategoryStaticParams(
         "tasker",
         allSubs,
         publishedCategoryTypes
      );

      for (const { slug, subcategory } of taskerSubParams) {
         const key = `${slug}/${subcategory}`;
         if (seen.has(key)) continue;
         seen.add(key);
         params.push({ slug: [slug, subcategory] });
      }

      return params.length > 0 ? params : [{ slug: ["_"] }];
   } catch (error) {
      console.error("Failed to build task catch-all static params:", error);
      return [{ slug: ["_"] }];
   }
}
