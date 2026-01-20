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
      // Fetch all published categories from content-admin backend
      const allCategories = await categoriesApi.getCategories();

      // Fetch subcategories for each category
      categories = await Promise.all(
         allCategories.map(async (cat) => {
            const subcategories = await categoriesApi.getSubcategories(cat.slug);
            return {
               _id: cat._id,
               name: cat.name,
               slug: cat.slug,
               heroImage: cat.heroImage,
               heroTitle: cat.heroTitle,
               heroDescription: cat.heroDescription,
               subcategories: subcategories as Subcategory[],
            };
         })
      );
   } catch (error) {
      console.error("Error fetching categories from content-admin:", error);
   }

   return <CategoriesClient categories={categories} viewType="services" />;
}
