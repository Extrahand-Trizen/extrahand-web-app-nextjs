import type { MetadataRoute } from "next";
import { cities } from "@/lib/data/cities";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import type { CategoriesListItem } from "@/lib/api/endpoints/categories";
import type { Subcategory } from "@/types/category";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in";

function joinUrl(base: string, path: string) {
   const baseClean = base.replace(/\/+$/, "");
   const pathClean = path.startsWith("/") ? path : `/${path}`;
   return `${baseClean}${pathClean}`;
}

function normalizeSlugPath(slug: string, parentSlug: string) {
   const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, "");
   const cleanParent = parentSlug.trim().replace(/^\/+|\/+$/g, "");

   if (!cleanSlug) return "";
   if (cleanSlug.includes("/")) return cleanSlug;
   return cleanParent ? `${cleanParent}/${cleanSlug}` : cleanSlug;
}

function shouldIncludeServices(type: string) {
   return type.includes("poster") || type.includes("both") || !type;
}

function shouldIncludeJobs(type: string) {
   return type.includes("tasker") || type.includes("both") || !type;
}

function collectPublishedSubcategorySlugs(
   categorySlug: string,
   subcategories: Subcategory[]
) {
   return subcategories
      .filter(
         (sub) =>
            (sub.isPublished === true ||
               sub.status === "PUBLISHED" ||
               sub.status === "APPROVED") &&
            Boolean(sub.slug)
      )
      .map((sub) => normalizeSlugPath(sub.slug, categorySlug))
      .filter(Boolean);
}

async function getAllPublishedSubcategorySlugs(
   category: CategoriesListItem
): Promise<string[]> {
   const fallbackFromCategory = collectPublishedSubcategorySlugs(
      category.slug,
      category.subcategories ?? []
   );

   const fetchedSubcategories = await categoriesApi
      .getSubcategories(category.slug)
      .catch(() => []);

   const fromApi = collectPublishedSubcategorySlugs(
      category.slug,
      fetchedSubcategories
   );

   return [...new Set([...fallbackFromCategory, ...fromApi])];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const now = new Date();

   const staticRoutes = [
      "",
      "/login",
      "/signup",
      "/how-it-works",
      "/discover",
      "/trust-safety",
      "/pricing",
      "/earn-money",
      "/tasker-guidelines",
      "/success-stories",
      "/resources",
      "/about-us",
      "/careers",
      "/press",
      "/faqs",
      "/privacy-policy",
      "/terms-and-conditions",
      "/refund-policy",
      "/provider-agreement",
      "/community-guidelines",
      "/report-an-issue",
      "/coming-soon",
      "/cookie-policy",
      "/services",
      "/jobs"
   ];

   const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
      url: joinUrl(baseUrl, path),
      lastModified: now,
      priority: path === "" ? 1 : 0.8,
   }));

   const locationEntries: MetadataRoute.Sitemap = Object.values(cities).map((city) => ({
      url: joinUrl(baseUrl, `/locations/${city.slug}`),
      lastModified: now,
      priority: 0.8,
   }));

   const allCategories = await categoriesApi.getCategories({
      includeUnpublished: false,
   });

   const dynamicPathPriority = new Map<string, number>();

   const addPath = (path: string, priority: number) => {
      if (!path) return;
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      const existingPriority = dynamicPathPriority.get(normalizedPath);
      if (existingPriority === undefined || priority > existingPriority) {
         dynamicPathPriority.set(normalizedPath, priority);
      }
   };

   const categoriesWithSubcategorySlugs = await Promise.all(
      allCategories
         .filter((cat) => Boolean(cat.slug))
         .map(async (cat) => ({
            category: cat,
            subcategorySlugs: await getAllPublishedSubcategorySlugs(cat),
         }))
   );

   for (const { category: cat, subcategorySlugs } of categoriesWithSubcategorySlugs) {
      const type = (cat.categoryType || "").toLowerCase();

      const includeInServices = shouldIncludeServices(type);
      const includeInJobs = shouldIncludeJobs(type);

      if (!includeInServices && !includeInJobs) continue;

      if (includeInServices) {
         addPath(`/services/${cat.slug}`, 0.7);
      }

      if (includeInJobs) {
         addPath(`/jobs/${cat.slug}`, 0.7);
      }

      for (const slugPath of subcategorySlugs) {
         if (includeInServices) {
            addPath(`/services/${slugPath}`, 0.6);
         }

         if (includeInJobs) {
            addPath(`/jobs/${slugPath}`, 0.6);
         }
      }
   }

   const dynamicEntries: MetadataRoute.Sitemap = Array.from(
      dynamicPathPriority.entries()
   ).map(([path, priority]) => ({
      url: joinUrl(baseUrl, path),
      lastModified: now,
      priority,
   }));

   // Put dynamic routes earlier so tools that show only the first N URLs
   // still display /services and /jobs.
   return [...entries, ...dynamicEntries, ...locationEntries];
}
