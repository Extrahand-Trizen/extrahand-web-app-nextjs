import React from "react";
import connectDB from "@/lib/mongodb";
import TaskCategory from "@/lib/models/TaskCategory";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { CategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface ServicePageProps {
   params: Promise<{
      slug: string;
   }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
   const { slug } = await params;

   if (!slug) {
      return <CategoryNotFound type="service" />;
   }

   let categoryData: CategoryDetail | null = null;

   try {
      await connectDB();

      const category = await TaskCategory.findOne({ slug } as any).lean();

      if (!category) {
         console.log(
            `Service category with slug "${slug}" not found in database.`
         );
         return <CategoryNotFound type="service" categoryName={slug} />;
      }

      if (!category.isPublished) {
         console.warn(
            `Service category "${slug}" is not published. Showing anyway in development mode.`
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
      console.error("Error fetching service category:", error);
      return <CategoryNotFound type="service" categoryName={slug} />;
   }

   if (!categoryData) {
      return <CategoryNotFound type="service" categoryName={slug} />;
   }

   return <CategoryDetailClient category={categoryData} />;
}

export async function generateMetadata({ params }: ServicePageProps) {
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
            `${category.name} Services`,
         description: category.metaDescription || category.heroDescription,
      };
   } catch {
      return {
         title: "Page Not Found",
      };
   }
}
