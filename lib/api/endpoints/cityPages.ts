import { cache } from "react";
import { isCityPageContent } from "@/lib/data/city-page-content";
import type { CityPageContent } from "@/lib/data/city-page-content";

const PRODUCTION_BACKEND_URL =
   "https://extrahand-content-admin-backend.backend.extrahand.in";
const CONTENT_ADMIN_URL =
   process.env.CONTENT_ADMIN_URL ||
   process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
   PRODUCTION_BACKEND_URL;

export interface PublishedCityPage {
   citySlug: string;
   cityName: string;
   content: CityPageContent;
}

export const getPublishedCityPage = cache(
   async (citySlug: string): Promise<PublishedCityPage | null> => {
      const url = `${CONTENT_ADMIN_URL}/api/city-pages/published?citySlug=${encodeURIComponent(citySlug)}`;

      try {
         const response = await fetch(url, { cache: "no-store" });
         if (response.status === 404) return null;
         if (!response.ok) {
            throw new Error(
               `City page API returned ${response.status} ${response.statusText}`
            );
         }

         const responseBody: unknown = await response.json();
         const document =
            typeof responseBody === "object" &&
            responseBody !== null &&
            "data" in responseBody
               ? responseBody.data
               : responseBody;

         if (
            typeof document !== "object" ||
            document === null ||
            !("citySlug" in document) ||
            !("cityName" in document) ||
            !("content" in document) ||
            document.citySlug !== citySlug ||
            typeof document.cityName !== "string" ||
            !isCityPageContent(document.content)
         ) {
            throw new Error("City page API returned an invalid published document");
         }

         return {
            citySlug: document.citySlug,
            cityName: document.cityName,
            content: document.content,
         };
      } catch (error) {
         console.error(
            `[CITY PAGE ERROR] Failed to fetch published content for "${citySlug}":`,
            error
         );
         return null;
      }
   }
);
