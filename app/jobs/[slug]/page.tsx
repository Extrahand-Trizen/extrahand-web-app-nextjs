import React from "react";
import connectDB from "@/lib/mongodb";
import TaskCategory from "@/lib/models/TaskCategory";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { CategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface JobPageProps {
   params: Promise<{
      slug: string;
   }>;
}

export default async function JobPage({ params }: JobPageProps) {
   const { slug } = await params;

   if (!slug) {
      return <CategoryNotFound type="job" />;
   }

   let categoryData: CategoryDetail | null = null;

   try {
      await connectDB();

      const category = await TaskCategory.findOne({ slug } as any).lean();

      if (!category) {
         console.log(`Job category with slug "${slug}" not found in database.`);
         return <CategoryNotFound type="job" categoryName={slug} />;
      }

      if (!category.isPublished) {
         console.warn(
            `Job category "${slug}" is not published. Showing anyway in development mode.`
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
      console.error("Error fetching job category:", error);
      return <CategoryNotFound type="job" categoryName={slug} />;
   }

   if (!categoryData) {
      return <CategoryNotFound type="job" categoryName={slug} />;
   }

   return <CategoryDetailClient category={categoryData} />;
}

export async function generateMetadata({ params }: JobPageProps) {
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
            category.metaTitle || category.heroTitle || `${category.name} Jobs`,
         description: category.metaDescription || category.heroDescription,
      };
   } catch {
      return {
         title: "Page Not Found",
      };
   }
}
