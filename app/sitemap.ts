import type { MetadataRoute } from "next";
import { cities } from "@/lib/data/cities";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in";

export default function sitemap(): MetadataRoute.Sitemap {
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
   ];

   const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      priority: path === "" ? 1 : 0.8,
   }));

   const locationEntries: MetadataRoute.Sitemap = Object.values(cities).map((city) => ({
      url: `${baseUrl}/locations/${city.slug}`,
      lastModified: now,
      priority: 0.8,
   }));

   return [...entries, ...locationEntries];
}
