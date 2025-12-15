import React from "react";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import TaskCategory from "@/lib/models/TaskCategory";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { CategoryDetail } from "@/types/category";

interface CategoryPageProps {
   params: Promise<{
      slug: string;
   }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
   const { slug } = await params;

   if (!slug) {
      notFound();
   }

   let categoryData: CategoryDetail | null = null;

   try {
      await connectDB();

      const category = await TaskCategory.findOne({ slug } as any).lean();

      if (!category) {
         console.log(`Category with slug "${slug}" not found in database.`);
         notFound();
      }

      if (!category.isPublished) {
         console.warn(
            `Category "${slug}" is not published. Showing anyway in development mode.`
         );
      }

      categoryData = JSON.parse(JSON.stringify(category)) as CategoryDetail;

      // Ensure incomeOpportunitiesData structure is correct
      if (categoryData.incomeOpportunitiesData) {
         if (!Array.isArray(categoryData.incomeOpportunitiesData.weekly)) {
            categoryData.incomeOpportunitiesData.weekly = [];
         }
         if (!Array.isArray(categoryData.incomeOpportunitiesData.monthly)) {
            categoryData.incomeOpportunitiesData.monthly = [];
         }
         if (!Array.isArray(categoryData.incomeOpportunitiesData.yearly)) {
            categoryData.incomeOpportunitiesData.yearly = [];
         }
      }
   } catch (error) {
      console.error("Error fetching category:", error);
      notFound();
   }

   if (!categoryData) {
      notFound();
   }

   return <CategoryDetailClient category={categoryData} />;
}

export async function generateMetadata({ params }: CategoryPageProps) {
   const { slug } = await params;

   try {
      await connectDB();
      const category = await TaskCategory.findOne({ slug } as any);

      if (!category) {
         return {
            title: "Page Not Found",
         };
      }

      return {
         title:
            category.metaTitle ||
            category.heroTitle ||
            `${category.name} Tasks`,
         description: category.metaDescription || category.heroDescription,
      };
   } catch {
      return {
         title: "Page Not Found",
      };
   }
}
