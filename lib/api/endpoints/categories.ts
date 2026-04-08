/**
 * Categories API - Fetches from content-admin backend
 * Directly hits the content-admin backend (not through API gateway)
 */

import { CategoryDetail, Subcategory } from "@/types/category";

const DEFAULT_CONTENT_ADMIN_URL =
   "https://extrahand-content-admin-backend.apps.extrahand.in";
const DEFAULT_APP_URL = "https://extrahand.in";
const CONTENT_ADMIN_URL =
   process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL || DEFAULT_CONTENT_ADMIN_URL;
const APP_ORIGIN =
   process.env.NEXT_PUBLIC_APP_URL ||
   process.env.APP_URL ||
   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_APP_URL);

function isAbsoluteUrl(value: string): boolean {
   return /^https?:\/\//i.test(value);
}

function toAbsoluteUrl(value: string): string {
   const normalized = (value || "").trim().replace(/\/+$/, "");
   if (!normalized) return "";
   if (isAbsoluteUrl(normalized)) return normalized;

   if (normalized.startsWith("/")) {
      const origin =
         typeof window !== "undefined" && window.location?.origin
            ? window.location.origin
            : APP_ORIGIN;
      const absoluteOrigin = isAbsoluteUrl(origin) ? origin.replace(/\/+$/, "") : "";
      return absoluteOrigin ? `${absoluteOrigin}${normalized}` : "";
   }

   return "";
}

function getContentAdminBaseUrls(): string[] {
   const configured = CONTENT_ADMIN_URL.replace(/\/+$/, "");
   const proxyBaseUrl = toAbsoluteUrl("/api/content-admin");
   const fallbackAbsolute = DEFAULT_CONTENT_ADMIN_URL;
   const configuredAbsolute = toAbsoluteUrl(configured);

   const baseUrls = [configuredAbsolute, proxyBaseUrl, fallbackAbsolute];

   return [...new Set(baseUrls.filter(Boolean))];
}

/**
 * Fetch wrapper for content-admin API calls
 * Uses no-store cache for real-time data
 */
async function fetchContentAdmin<T>(
   path: string,
   options: RequestInit = {}
): Promise<T | null> {
   const baseUrls = getContentAdminBaseUrls();

   for (const baseUrl of baseUrls) {
      const url = `${baseUrl}${path}`;

      try {
         console.log(`📦 Fetching from content-admin: ${url}`);

         const res = await fetch(url, {
            ...options,
            headers: {
               "Content-Type": "application/json",
               ...options.headers,
            },
            cache: "no-store", // Always get fresh data for SSR
         });

         if (!res.ok) {
            if (res.status === 404) {
               console.warn(`Content-admin route not found: ${url}`);
               continue;
            }
            console.error(
               `❌ Content-admin API error: ${res.status} ${res.statusText}`
            );
            continue;
         }

         const data = await res.json();
         console.log(`✅ Content-admin API success: ${path}`);
         return data as T;
      } catch (error) {
         console.error(`❌ Content-admin fetch error for ${path}:`, error);
         continue;
      }
   }

   return null;
}

export interface CategoriesListItem {
   _id?: string;
   name: string;
   slug: string;
   heroImage?: string;
   heroTitle: string;
   heroDescription: string;
   isPublished?: boolean;
   categoryType?: string;
   status?: string;
   subcategories?: Subcategory[];
}

export const categoriesApi = {
   /**
    * Get all categories (no filter - returns all categories)
    * @returns Array of categories or empty array on error
    */
   async getCategories(
      options: { includeUnpublished?: boolean } = {}
   ): Promise<CategoriesListItem[]> {
      const query = options.includeUnpublished ? "?includeUnpublished=true" : "";
      const categories = await fetchContentAdmin<CategoriesListItem[]>(
         `/api/task-categories${query}`
      );

      if (!categories) return [];

      if (options.includeUnpublished) return categories;

      // Only return categories that are published
      return categories.filter(
         (cat) =>
            cat.isPublished === true ||
            cat.status === "PUBLISHED" ||
            cat.status === "APPROVED"
      );
   },

   /**
    * Get a category or subcategory by slug
    * The content-admin API automatically falls back to subcategories if not found in categories
    * @param slug The category/subcategory slug
    * @returns Category data or null if not found
    */
   async getCategoryBySlug(slug: string): Promise<CategoryDetail | null> {
      return fetchContentAdmin<CategoryDetail>(
         `/api/task-categories?slug=${encodeURIComponent(slug)}`
      );
   },

   /**
    * Get all published subcategories for a category
    * @param categorySlug The parent category slug
    * @returns Array of subcategories or empty array on error
    */
   async getSubcategories(categorySlug: string): Promise<Subcategory[]> {
      const subcategories = await fetchContentAdmin<Subcategory[]>(
         `/api/task-subcategories?categorySlug=${encodeURIComponent(categorySlug)}`
      );

      if (!subcategories) return [];

      // Filter to only published subcategories (if the API returns all)
      return subcategories.filter(
         (sub) =>
            sub.isPublished === true ||
            sub.status === "PUBLISHED" ||
            sub.status === "APPROVED"
      );
   },

   /**
    * Get a subcategory by its slug
    * @param slug The subcategory slug
    * @returns Subcategory data or null if not found
    */
   async getSubcategoryBySlug(slug: string): Promise<CategoryDetail | null> {
      return fetchContentAdmin<CategoryDetail>(
         `/api/task-subcategories?slug=${encodeURIComponent(slug)}`
      );
   },
};
