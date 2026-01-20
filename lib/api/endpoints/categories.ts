/**
 * Categories API - Fetches from content-admin backend
 * Directly hits the content-admin backend (not through API gateway)
 */

import { CategoryDetail, Category, Subcategory } from "@/types/category";

const CONTENT_ADMIN_URL =
   process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL || "http://localhost:5001";

/**
 * Fetch wrapper for content-admin API calls
 * Uses no-store cache for real-time data
 */
async function fetchContentAdmin<T>(
   path: string,
   options: RequestInit = {}
): Promise<T | null> {
   const url = `${CONTENT_ADMIN_URL}${path}`;

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
         console.error(`❌ Content-admin API error: ${res.status} ${res.statusText}`);
         return null;
      }

      const data = await res.json();
      console.log(`✅ Content-admin API success: ${path}`);
      return data as T;
   } catch (error) {
      console.error(`❌ Content-admin fetch error for ${path}:`, error);
      return null;
   }
}

export interface CategoriesListItem {
   _id?: string;
   name: string;
   slug: string;
   heroImage?: string;
   heroTitle: string;
   heroDescription: string;
   isPublished: boolean;
   subcategories?: Subcategory[];
}

export const categoriesApi = {
   /**
    * Get all published categories
    * @returns Array of categories or empty array on error
    */
   async getCategories(): Promise<CategoriesListItem[]> {
      const categories = await fetchContentAdmin<CategoriesListItem[]>(
         "/api/task-categories"
      );

      if (!categories) return [];

      // Filter to only published categories
      return categories.filter((cat) => cat.isPublished);
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
      return subcategories.filter((sub: any) => sub.isPublished !== false);
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
