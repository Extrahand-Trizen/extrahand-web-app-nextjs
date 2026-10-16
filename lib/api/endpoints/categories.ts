import { cache } from "react";
import { CategoryDetail, Subcategory } from "@/types/category";

const DEFAULT_CONTENT_ADMIN_URL =
   "https://extrahand-content-admin-backend.backend.extrahand.in";
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
   const fallbackAbsolute = DEFAULT_CONTENT_ADMIN_URL;
   const configuredAbsolute = toAbsoluteUrl(configured);

   const baseUrls = [configuredAbsolute, fallbackAbsolute];

   return [...new Set(baseUrls.filter(Boolean))];
}

/**
 * Fetch wrapper for content-admin API calls
 * Uses no-store cache for real-time data
 */
async function fetchContentAdmin<T>(
   path: string,
   options: RequestInit = {},
   throwOnError = false
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
            // Cache category data for 1 hour on the server.
            // Categories change rarely; no-store was triggering a fresh upstream
            // call on every SSR render (including sitemap generation), causing
            // cascading load on the content-admin service at deploy time.
            next: { revalidate: 3600 },
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

   if (throwOnError) {
      throw new Error(`Unable to fetch content-admin resource: ${path}`);
   }

   return null;
}

type PaginatedListResponse<T> = {
   data?: T[];
   pagination?: {
      page?: number;
      pages?: number;
      total?: number;
   };
};

function normalizeListResponse<T>(
   payload: T[] | PaginatedListResponse<T> | null | undefined
): T[] {
   if (!payload) return [];
   if (Array.isArray(payload)) return payload;
   if (Array.isArray(payload.data)) return payload.data;
   return [];
}

function isPublicWebListItem(item: {
   isPublished?: boolean;
   status?: string;
}): boolean {
   const status = (item.status || "").toUpperCase();
   return (
      item.isPublished === true ||
      status === "PUBLISHED" ||
      status === "APPROVED"
   );
}

async function fetchAllContentAdminPages<T>(
   path: string,
   pageSize = 200,
   throwOnError = false
): Promise<T[]> {
   const firstPagePath = path.includes("?")
      ? `${path}&page=1&limit=${pageSize}`
      : `${path}?page=1&limit=${pageSize}`;

   const firstPayload = await fetchContentAdmin<T[] | PaginatedListResponse<T>>(
       firstPagePath,
       {},
       throwOnError
    );

    if (!firstPayload) {
       if (throwOnError) {
          throw new Error(`Content-admin returned no data for ${path}`);
       }
       return [];
    }

   if (Array.isArray(firstPayload)) {
      return firstPayload;
   }

   const items = normalizeListResponse(firstPayload);
   const totalPages = firstPagePath.includes("page=1")
      ? firstPayload.pagination?.pages ?? 1
      : 1;

   if (totalPages <= 1) {
      return items;
   }

   const allItems = [...items];

   for (let page = 2; page <= totalPages; page += 1) {
      const pagePath = path.includes("?")
         ? `${path}&page=${page}&limit=${pageSize}`
         : `${path}?page=${page}&limit=${pageSize}`;

      const pagePayload = await fetchContentAdmin<
         T[] | PaginatedListResponse<T>
      >(pagePath, {}, throwOnError);

      if (!pagePayload && throwOnError) {
         throw new Error(`Content-admin returned no data for ${pagePath}`);
      }

      allItems.push(...normalizeListResponse(pagePayload));
   }

   return allItems;
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
      options: { includeUnpublished?: boolean; throwOnError?: boolean } = {}
   ): Promise<CategoriesListItem[]> {
      const query = options.includeUnpublished ? "?includeUnpublished=true" : "";
      const categories = await fetchAllContentAdminPages<CategoriesListItem>(
         `/api/task-categories${query}`,
         200,
         options.throwOnError
      );

      if (categories.length === 0) return [];

      if (options.includeUnpublished) return categories;

      // Public website: approved + published rows only (not draft/pending).
      return categories.filter(isPublicWebListItem);
   },

   /**
    * Get a category or subcategory by slug
    * The content-admin API automatically falls back to subcategories if not found in categories
    * Wrapped in React cache() for request deduplication in SSR and metadata.
    * @param slug The category/subcategory slug
    * @returns Category data or null if not found
    */
   getCategoryBySlug: cache(async (slug: string): Promise<CategoryDetail | null> => {
      return fetchContentAdmin<CategoryDetail>(
         `/api/task-categories?slug=${encodeURIComponent(slug)}`
      );
   }),

   /**
    * Get all published subcategories for a category
    * @param categorySlug The parent category slug
    * @returns Array of subcategories or empty array on error
    */
   async getSubcategories(categorySlug: string): Promise<Subcategory[]> {
      const subcategories = await fetchAllContentAdminPages<Subcategory>(
         `/api/task-subcategories?categorySlug=${encodeURIComponent(categorySlug)}`
      );

      if (subcategories.length === 0) return [];

      return subcategories.filter(isPublicWebListItem);
   },

   /**
    * Get all published subcategories across every parent category.
    */
   async getAllSubcategories(
      options: { throwOnError?: boolean } = {}
   ): Promise<Subcategory[]> {
      const subcategories = await fetchAllContentAdminPages<Subcategory>(
         "/api/task-subcategories",
         200,
         options.throwOnError
      );

      if (subcategories.length === 0) return [];

      return subcategories.filter(isPublicWebListItem);
   },

   /**
    * Get a subcategory by its slug
    * Wrapped in React cache() for request deduplication in SSR and metadata.
    * @param slug The subcategory slug
    * @returns Subcategory data or null if not found
    */
   getSubcategoryBySlug: cache(async (slug: string): Promise<CategoryDetail | null> => {
      return fetchContentAdmin<CategoryDetail>(
         `/api/task-subcategories?slug=${encodeURIComponent(slug)}`
      );
   }),
};
