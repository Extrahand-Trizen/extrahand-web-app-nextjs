import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoriesClient from "@/components/categories/CategoriesClient";
import { Category, Subcategory } from "@/types/category";

/**
 * Services Page (Server Component) - For Posters looking to hire
 * Fetches categories from content-admin backend API
 */
export default async function ServicesPage() {
   let categories: Category[] = [];

   try {
      // Fetch published categories only to display to all users (both posters and guests)
      const allCategories = await categoriesApi.getCategories({
         includeUnpublished: false,
      });

      // Filter and map categories for poster view
      if (Array.isArray(allCategories)) {
         categories = allCategories
            .filter((cat: any) => {
               const type = (cat.categoryType || "").toLowerCase();
               // Show categories that are for "poster" or "both"
               return type.includes("poster") || type.includes("both") || !type;
            })
            .map((cat: any) => ({
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

   return <CategoriesClient categories={categories} viewType="services" />;
}
