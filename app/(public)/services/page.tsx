import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoriesClient from "@/components/categories/CategoriesClient";
import { Category } from "@/types/category";

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
         const posterCategories = allCategories
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

         // Fallback: if embedded subcategories are empty, fetch by category slug.
         categories = await Promise.all(
            posterCategories.map(async (category) => {
               const hasEmbeddedSubcategories =
                  Array.isArray(category.subcategories) &&
                  category.subcategories.length > 0;

               if (hasEmbeddedSubcategories || !category.slug) {
                  return category;
               }

               const fetchedSubcategories = await categoriesApi.getSubcategories(
                  category.slug
               );

               return {
                  ...category,
                  subcategories: Array.isArray(fetchedSubcategories)
                     ? fetchedSubcategories
                     : [],
               };
            })
         );

         // Keep categories as-is on poster services "view all" page so
         // car-related categories remain separate with their own subcategories.
      }
   } catch (error) {
      console.error("Error fetching categories from content-admin");
   }

   return <CategoriesClient categories={categories} viewType="services" />;
}
