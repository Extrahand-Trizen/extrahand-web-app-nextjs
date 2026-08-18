import { categoriesApi } from "@/lib/api/endpoints/categories";
import {
   categoryMatchesRole,
   filterCategoriesByRole,
} from "@/lib/utils/categoryRoleFilter";
import type { Subcategory } from "@/types/category";

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
      if (!parentSlug) continue;

      const routeSubcategory = getSubcategoryRouteSegment(sub);
      if (!routeSubcategory) continue;

      const parentType = publishedCategoryTypes.get(parentSlug);
      if (parentType !== undefined) {
         if (!categoryMatchesRole(parentType, role)) continue;
      } else if (role === "tasker") {
         // Published subcategories whose parent category is not yet published
         // are service (poster) pages only.
         continue;
      }

      const key = `${parentSlug}/${routeSubcategory}`;
      if (seen.has(key)) continue;
      seen.add(key);
      params.push({ slug: parentSlug, subcategory: routeSubcategory });
   }

   return params;
}

/** Slugs for /jobs/[slug] — published categories visible to taskers/helpers. */
export async function getJobCategoryStaticParams(): Promise<{ slug: string }[]> {
   try {
      const categories = await categoriesApi.getCategories({
         includeUnpublished: false,
      });
      const taskerCategories = filterCategoriesByRole(categories, "tasker");
      const seen = new Set<string>();

      return taskerCategories.filter(({ slug }) => {
         if (!slug || seen.has(slug)) return false;
         seen.add(slug);
         return true;
      }).map(({ slug }) => ({ slug }));
   } catch (error) {
      console.error("Failed to build job category static params:", error);
      return [{ slug: "_" }];
   }
}

/** Slugs for /services/[slug] — published categories visible to posters. */
export async function getServiceCategoryStaticParams(): Promise<{ slug: string }[]> {
   try {
      const categories = await categoriesApi.getCategories({
         includeUnpublished: false,
      });
      const posterCategories = filterCategoriesByRole(categories, "poster");
      const seen = new Set<string>();

      const params = posterCategories
         .filter(({ slug }) => {
            if (!slug || seen.has(slug)) return false;
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
      const [categories, allSubs] = await Promise.all([
         categoriesApi.getCategories({ includeUnpublished: false }),
         categoriesApi.getAllSubcategories(),
      ]);

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

/** Params for /task/[...slug] (tasker job pages, catch-all). */
export async function getTaskCatchAllStaticParams(): Promise<{ slug: string[] }[]> {
   try {
      const [categories, allSubs] = await Promise.all([
         categoriesApi.getCategories({ includeUnpublished: false }),
         categoriesApi.getAllSubcategories(),
      ]);
      const taskerCategories = filterCategoriesByRole(categories, "tasker");
      const publishedCategoryTypes = new Map(
         categories.map((cat) => [cat.slug, cat.categoryType])
      );
      const params: { slug: string[] }[] = [];
      const seen = new Set<string>();

      for (const cat of taskerCategories) {
         if (!cat.slug) continue;

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
