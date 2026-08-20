import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoriesClient from "@/components/categories/CategoriesClient";
import { Category, Subcategory } from "@/types/category";
import { filterCategoriesByRole } from "@/lib/utils/categoryRoleFilter";

/**
 * Jobs Page (Server Component) - For Taskers looking for work
 * Fetches categories from content-admin backend API
 */
export default async function JobsPage() {
   let categories: Category[] = [];

   try {
      // Fetch published categories only to display to all users (both taskers and guests)
      const allCategories = await categoriesApi.getCategories({
         includeUnpublished: false,
      });

      // Filter and map categories for tasker view
      if (Array.isArray(allCategories)) {
         let subcategoriesMap: Map<string, Subcategory[]> | null = null;

         const hasAnySubcategories = allCategories.some(
            (cat) => Array.isArray(cat.subcategories) && cat.subcategories.length > 0
         );

         // If backend did not embed subcategories, fetch all subcategories in 1 single bulk API call
         if (!hasAnySubcategories) {
            const allSubcategories = await categoriesApi.getAllSubcategories();
            subcategoriesMap = new Map();
            allSubcategories.forEach((sub) => {
               if (sub.categorySlug) {
                  const existing = subcategoriesMap!.get(sub.categorySlug) || [];
                  existing.push(sub);
                  subcategoriesMap!.set(sub.categorySlug, existing);
               }
            });
         }

         categories = filterCategoriesByRole(allCategories, "tasker").map((cat) => ({
            _id: cat._id || "",
            name: cat.name || "",
            slug: cat.slug || "",
            heroImage: cat.heroImage || "",
            heroTitle: cat.heroTitle || "",
            heroDescription: cat.heroDescription || "",
            subcategories:
               Array.isArray(cat.subcategories) && cat.subcategories.length > 0
                  ? cat.subcategories
                  : (subcategoriesMap?.get(cat.slug) || []),
         }));
      }
   } catch (error) {
      console.error("Error fetching categories from content-admin:", error);
   }

   return <CategoriesClient categories={categories} viewType="jobs" />;
}
