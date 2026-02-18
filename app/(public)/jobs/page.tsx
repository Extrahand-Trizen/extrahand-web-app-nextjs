import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoriesClient from "@/components/categories/CategoriesClient";
import { Category, Subcategory } from "@/types/category";

/**
 * Jobs Page (Server Component) - For Taskers looking for work
 * Fetches categories from content-admin backend API
 */
export default async function JobsPage() {
   let categories: Category[] = [];

   try {
      // Fetch all categories - they now include subcategories from the backend
      const allCategories = await categoriesApi.getCategories({
         includeUnpublished: true,
      });

      // Map categories to ensure proper structure
      if (Array.isArray(allCategories)) {
         categories = allCategories.map((cat: any) => ({
            _id: cat._id || "",
            name: cat.name || "",
            slug: cat.slug || "",
            heroImage: cat.heroImage || "",
            heroTitle: cat.heroTitle || "",
            heroDescription: cat.heroDescription || "",
            subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : [],
         }));
      }
   } catch (error) {
      console.error("Error fetching categories from content-admin");
   }

   return <CategoriesClient categories={categories} viewType="jobs" />;
}
