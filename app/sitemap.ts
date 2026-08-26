import type { MetadataRoute } from "next";
import { cities } from "@/lib/data/cities";
import { hyderabadServicePageSlugs } from "@/lib/data/hyderabad-service-pages";
import { manualServicePrimaryPaths } from "@/lib/data/manual-services-catalog";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import { getAllPublishedSeoPages } from "@/lib/api/endpoints/seoPages";

export const revalidate = 300;

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
   const entriesByUrl = new Map<string, MetadataRoute.Sitemap[number]>();

   const addEntry = (
      url: string,
      priority: number,
      lastModified: Date | string = now
   ) => {
      if (!entriesByUrl.has(url)) {
         entriesByUrl.set(url, { url, lastModified, priority });
      }
   };

   const staticRoutes = [
      "",
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
      "/jobs",
   ];

   for (const path of staticRoutes) {
      addEntry(joinUrl(baseUrl, path), path === "" ? 1 : 0.8);
   }

   for (const city of Object.values(cities)) {
      addEntry(joinUrl(baseUrl, `/locations/${city.slug}`), 0.8);
   }

   for (const slug of hyderabadServicePageSlugs) {
      addEntry(joinUrl(baseUrl, `/${slug}/`), 0.75);
   }

   for (const path of manualServicePrimaryPaths) {
      addEntry(joinUrl(baseUrl, path), 0.65);
   }

   // Published CMS pages are read at request time and refreshed hourly.
   // Use the stored canonical URL verbatim so sitemap and canonical always match.
   const publishedSeoPages = await getAllPublishedSeoPages();
   for (const page of publishedSeoPages ?? []) {
      const canonicalUrl = page.canonicalUrl?.trim() || `${joinUrl(baseUrl, `/${page.slug}`)}/`;
      const alternateUrl = canonicalUrl.endsWith("/")
         ? canonicalUrl.slice(0, -1)
         : `${canonicalUrl}/`;
      entriesByUrl.delete(alternateUrl);
      entriesByUrl.set(canonicalUrl, {
         url: canonicalUrl,
         lastModified: page.updatedAt || now,
         priority: 0.8,
      });
   }

   const allCategories = await categoriesApi.getCategories({
      includeUnpublished: false,
   });

   for (const cat of allCategories.filter((category) => Boolean(category.slug))) {
      const type = (cat.categoryType || "").toLowerCase();

      if (shouldIncludeServices(type)) {
         addEntry(joinUrl(baseUrl, `/services/${cat.slug}`), 0.7);
      }

      if (shouldIncludeJobs(type)) {
         addEntry(joinUrl(baseUrl, `/jobs/${cat.slug}`), 0.7);
      }
   }

   return Array.from(entriesByUrl.values());
}
