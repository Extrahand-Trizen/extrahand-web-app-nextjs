import type { MetadataRoute } from "next";
import { cities } from "@/lib/data/cities";
import { categoriesApi } from "@/lib/api/endpoints/categories";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in";

function joinUrl(base: string, path: string) {
   const baseClean = base.replace(/\/+$/, "");
   const pathClean = path.startsWith("/") ? path : `/${path}`;
   return `${baseClean}${pathClean}`;
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

   // Add dynamic service pages from content-admin categories.
   // Routes:
   // - /services/[slug]                 -> app/(public)/services/[slug]/page.tsx
   // - /services/[slug]/[subcategory] -> app/(public)/services/[slug]/[subcategory]/page.tsx
   const serviceEntries: MetadataRoute.Sitemap = [];

   // Routes:
   // - /jobs/[slug]                 -> app/(public)/jobs/[slug]/page.tsx
   // - /jobs/[slug]/[subcategory] -> app/(public)/jobs/[slug]/[subcategory]/page.tsx
   const jobEntries: MetadataRoute.Sitemap = [];

   const allCategories = await categoriesApi.getCategories({
      includeUnpublished: false,
   });

   for (const cat of allCategories) {
      const type = (cat.categoryType || "").toLowerCase();

      // Match the same filter logic used in app/(public)/services/page.tsx
      const includeInServices =
         type.includes("poster") || type.includes("both") || !type;

      // Match the same filter logic used in app/(public)/jobs/page.tsx
      const includeInJobs =
         type.includes("tasker") || type.includes("both") || !type;

      if (!includeInServices && !includeInJobs) continue;
      if (!cat.slug) continue;

      if (includeInServices) {
         serviceEntries.push({
            url: joinUrl(baseUrl, `/services/${cat.slug}`),
            lastModified: now,
            priority: 0.7,
         });
      }

      if (includeInJobs) {
         jobEntries.push({
            url: joinUrl(baseUrl, `/jobs/${cat.slug}`),
            lastModified: now,
            priority: 0.7,
         });
      }

      const subcategories = await categoriesApi.getSubcategories(cat.slug);
      for (const sub of subcategories) {
         if (!sub.slug) continue;

         if (includeInServices) {
            serviceEntries.push({
               url: joinUrl(baseUrl, `/services/${cat.slug}/${sub.slug}`),
               lastModified: now,
               priority: 0.6,
            });
         }

         if (includeInJobs) {
            jobEntries.push({
               url: joinUrl(baseUrl, `/jobs/${cat.slug}/${sub.slug}`),
               lastModified: now,
               priority: 0.6,
            });
         }
      }
   }

   return [...entries, ...locationEntries, ...serviceEntries, ...jobEntries];
}
