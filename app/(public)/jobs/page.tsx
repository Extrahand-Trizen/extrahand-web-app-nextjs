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
 * Jobs Page (Server Component) - For Taskers looking for work
 * Fetches categories from MongoDB and passes them to client component
 */
export default async function JobsPage() {
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

            category.subcategories = subcategories.map((subcat: any) =>
               JSON.parse(JSON.stringify(subcat))
            );
         } catch (err) {
            console.error(
               `Failed to fetch subcategories for ${category.name}:`,
               err
            );
            category.subcategories = [];
         }
      }
   } catch (error) {
      console.error("Error fetching categories:", error);
   }

   return <CategoriesClient categories={categories} viewType="jobs" />;
}

