import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoriesClient from "@/components/categories/CategoriesClient";
import { Category } from "@/types/category";
import { PUBLIC_CATEGORY_SLUGS } from "@/lib/data/public-category-allowlist";

/**
 * Jobs Page (Server Component) - For Taskers looking for work
 * Fetches categories from content-admin backend API
 */
export default async function JobsPage() {
   let categories: Category[] = [];

   try {
      // Fetch published categories only to display to all users (both taskers and guests)
      const allCategories = await categoriesApi.getCategoriesBySlugs(
         PUBLIC_CATEGORY_SLUGS,
         { includeUnpublished: false }
      );

      // Map the approved categories for the jobs listing.
      if (Array.isArray(allCategories)) {
         categories = await Promise.all(
            allCategories.map(async (cat) => ({
               _id: cat._id || "",
               name: cat.name || "",
               slug: cat.slug || "",
               heroImage: cat.heroImage || "",
               heroTitle: cat.heroTitle || "",
               heroDescription: cat.heroDescription || "",
               subcategories:
                  Array.isArray(cat.subcategories) && cat.subcategories.length > 0
                     ? cat.subcategories
                     : await categoriesApi.getSubcategories(cat.slug),
            }))
         );
      }
   } catch (error) {
      console.error("Error fetching categories from content-admin:", error);
   }

   return <CategoriesClient categories={categories} viewType="jobs" />;
}
