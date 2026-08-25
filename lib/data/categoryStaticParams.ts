import { categoriesApi } from "@/lib/api/endpoints/categories";
import {
   categoryMatchesRole,
   filterCategoriesByRole,
} from "@/lib/utils/categoryRoleFilter";
import type { Subcategory } from "@/types/category";

/**
 * Category slugs directly belonging to the 29 core local/home services.
 * Pre-built at build time; all other categories are rendered on-demand via ISR.
 */
export const CORE_29_SERVICE_CATEGORY_SLUGS = new Set([
   // Electrician
   "electricians-services",
   "electrician",
   "auto-electricians-services",
   "auto-electrician",
   // Plumber
   "plumbing-services",
   "plumber",
   // Appliances (AC, Washing Machine, Refrigerator, TV, Microwave, Geyser, RO)
   "appliances-services",
   "appliance-repair",
   "heating-cooling-services",
   // Carpenter & Furniture
   "carpentry-services",
   "carpenter",
   "cabinet-maker",
   "furniture-assembly-services",
   "assembly-services",
   // Cleaning (Home, Deep, Sofa, Bathroom, Kitchen, Car)
   "cleaning-services",
   "cleaner",
   "house-cleaner",
   "housekeeper",
   "commercial-cleaner",
   "carpet-cleaner",
   "office-cleaner",
   "window-cleaner",
   "laundry-services",
   "car-wash",
   "car-detailing-services",
   "car-service-services",
   "car-body-work-services",
   "car-repair-services",
   // Painting
   "painting-services",
   "painter",
   "plasterer",
   "plasterer-services",
   "wallpapering-services",
   // Pest Control
   "pest-control-services",
   "pest-controller",
   // Moving, Shifting, Relocation
   "removals-services",
   "removalist",
   "delivery-services",
   "delivery",
   "courier-services",
   "rubbish-removal",
   // Cooking & Home Chef
   "chef-services",
   "chef",
   "cooking",
   "catering-services",
   "caterer",
   "bakers-services",
   // Driver
   "driving",
   // Event Services
   "events-services",
   "entertainment-services",
   "bartender",
   "barista",
   "wait-staff",
   // Fitness Trainers
   "fitness-services",
   "hiit-trainer",
   "pilates-instructor",
   // Beauty Services
   "beauticians-services",
   "makeup-artist-services",
   "makeup-artist",
   "hairdressers-services",
   "barbers-services",
   // CCTV & Security / Handyman
   "home-automation-and-security-services",
   "handyman-services",
   "handyman",
   "property-maintenance",
   "locksmith",
   "locksmith-services",
]);

export function isCore29Category(categorySlug: string): boolean {
   return CORE_29_SERVICE_CATEGORY_SLUGS.has(categorySlug.toLowerCase().trim());
}

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
      if (!parentSlug || !isCore29Category(parentSlug)) continue;

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

/** Slugs for /jobs/[slug] — published categories belonging to the 29 core services. */
export async function getJobCategoryStaticParams(): Promise<{ slug: string }[]> {
   try {
      const categories = await categoriesApi.getCategories({
         includeUnpublished: false,
      });
      const taskerCategories = filterCategoriesByRole(categories, "tasker");
      const seen = new Set<string>();

      return taskerCategories
         .filter(({ slug }) => {
            if (!slug || !isCore29Category(slug) || seen.has(slug)) return false;
            seen.add(slug);
            return true;
         })
         .map(({ slug }) => ({ slug }));
   } catch (error) {
      console.error("Failed to build job category static params:", error);
      return [{ slug: "_" }];
   }
}

/** Slugs for /services/[slug] — published categories belonging to the 29 core services. */
export async function getServiceCategoryStaticParams(): Promise<{ slug: string }[]> {
   try {
      const categories = await categoriesApi.getCategories({
         includeUnpublished: false,
      });
      const posterCategories = filterCategoriesByRole(categories, "poster");
      const seen = new Set<string>();

      const params = posterCategories
         .filter(({ slug }) => {
            if (!slug || !isCore29Category(slug) || seen.has(slug)) return false;
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

/** Params for /task/[...slug] (tasker job pages, catch-all) for the 29 core services. */
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
         if (!cat.slug || !isCore29Category(cat.slug)) continue;

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
