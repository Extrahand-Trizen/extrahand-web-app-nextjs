import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import PosterCategoryPageClient from "@/components/poster/PosterCategoryPageClient";
import { CategoryDetail, PosterCategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface ServicePageProps {
   params: Promise<{
      slug: string;
   }>;
}

/**
 * Ensure incomeOpportunitiesData has proper array structure
 */
function normalizeIncomeOpportunitiesData(data: CategoryDetail): CategoryDetail {
   if (data.incomeOpportunitiesData) {
      if (!Array.isArray(data.incomeOpportunitiesData.weekly)) {
         data.incomeOpportunitiesData.weekly = [];
      }
      if (!Array.isArray(data.incomeOpportunitiesData.monthly)) {
         data.incomeOpportunitiesData.monthly = [];
      }
      if (!Array.isArray(data.incomeOpportunitiesData.yearly)) {
         data.incomeOpportunitiesData.yearly = [];
      }
   }
   return data;
}

export default async function ServicePage({ params }: ServicePageProps) {
   const { slug } = await params;

   if (!slug) {
      return <CategoryNotFound type="service" />;
   }

   const categoryData = await categoriesApi.getCategoryBySlug(slug);

   if (!categoryData) {
      console.log(`Service category with slug "${slug}" not found.`);
      return <CategoryNotFound type="service" categoryName={slug} />;
   }

   if (!categoryData.isPublished) {
      console.warn(
         `Service category "${slug}" is not published. Showing anyway in development mode.`
      );
   }

   const normalizedData = normalizeIncomeOpportunitiesData(categoryData) as PosterCategoryDetail;

   // Services pages are poster-facing by design: always use the poster category layout
   return <PosterCategoryPageClient category={normalizedData} />;
}

export async function generateMetadata({ params }: ServicePageProps) {
   const { slug } = await params;

   const category = await categoriesApi.getCategoryBySlug(slug);

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
}
