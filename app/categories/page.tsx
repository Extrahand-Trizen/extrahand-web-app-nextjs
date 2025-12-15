import React from "react";
import connectDB from "@/lib/mongodb";
import TaskCategory from "@/lib/models/TaskCategory";
import TaskSubcategory from "@/lib/models/TaskSubcategory";
import CategoriesClient from "@/components/categories/CategoriesClient";

interface Category {
   _id?: string;
   name: string;
   slug: string;
   heroImage?: string;
   heroTitle: string;
   heroDescription: string;
   subcategories?: Subcategory[];
}

interface Subcategory {
   _id?: string;
   name: string;
   slug: string;
}

/**
 * Categories Page (Server Component)
 * Fetches categories from MongoDB and passes them to client component
 */
export default async function CategoriesPage() {
   let categories: Category[] = [];

   try {
      await connectDB();

      // Fetch all published categories from database, sorted by name
      const allCategories = await TaskCategory.find({
         isPublished: true,
      } as any)
         .select("name slug heroImage heroTitle heroDescription")
         .sort({ name: 1 })
         .lean();

      // Convert to plain objects
      categories = allCategories.map((cat: any) =>
         JSON.parse(JSON.stringify(cat))
      );

      // Fetch subcategories for each category
      for (let category of categories) {
         try {
            const subcategories = await TaskSubcategory.find({
               categorySlug: category.slug,
               isPublished: true,
            } as any)
               .select("name slug")
               .sort({ name: 1 })
               .lean();

            category.subcategories = subcategories.map((sub: any) =>
               JSON.parse(JSON.stringify(sub))
            );
         } catch (error) {
            console.error(
               `Error fetching subcategories for ${category.slug}:`,
               error
            );
            category.subcategories = [];
         }
      }
   } catch (error) {
      console.error("Error fetching categories:", error);
      // If there's an error, categories will remain empty array
      // The page will still render but without categories
   }

   return <CategoriesClient categories={categories} />;
}
