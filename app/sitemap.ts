import type { MetadataRoute } from "next";
import { cities } from "@/lib/data/cities";
import { hyderabadServicePageSlugs } from "@/lib/data/hyderabad-service-pages";
import { manualServicePrimaryPaths } from "@/lib/data/manual-services-catalog";
import { categoriesApi } from "@/lib/api/endpoints/categories";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in";

function joinUrl(base: string, path: string) {
   const baseClean = base.replace(/\/+$/, "");
   const pathClean = path.startsWith("/") ? path : `/${path}`;
   return `${baseClean}${pathClean}`;
}

function shouldIncludeServices(type: string) {
   return type.includes("poster") || type.includes("both") || !type;
}

function shouldIncludeJobs(type: string) {
   return type.includes("tasker") || type.includes("both") || !type;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const now = new Date();

   const staticRoutes = [
      "",
      "/login",
      "/signup",
      "/how-it-works",
      "/blog",
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

   const hyderabadServiceEntries: MetadataRoute.Sitemap = hyderabadServicePageSlugs.map(
      (slug) => ({
         url: joinUrl(baseUrl, `/${slug}`),
         lastModified: now,
         priority: 0.75,
      })
   );

   const manualServiceEntries: MetadataRoute.Sitemap = manualServicePrimaryPaths.map(
      (path) => ({
         url: joinUrl(baseUrl, path),
         lastModified: now,
         priority: 0.65,
      })
   );

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

   for (const cat of allCategories.filter((c) => Boolean(c.slug))) {
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

      // Sub-services are sections on the primary /services/[slug] or /jobs/[slug] page (hash links), not separate URLs.
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
   return [
      ...entries,
      ...hyderabadServiceEntries,
      ...manualServiceEntries,
      ...dynamicEntries,
      ...locationEntries,
   ];
}
