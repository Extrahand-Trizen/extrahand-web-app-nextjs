import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import PosterCategoryPageClient from "@/components/poster/PosterCategoryPageClient";
import { PosterCategoryDetail, SubcategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface ServiceSubcategoryPageProps {
   params: Promise<{
      slug: string;
      subcategory: string;
   }>;
}

/**
 * Ensure incomeOpportunitiesData has proper array structure
 */
function normalizeIncomeOpportunitiesData(
   data: SubcategoryDetail
): SubcategoryDetail {
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

export default async function ServiceSubcategoryPage({
   params,
}: ServiceSubcategoryPageProps) {
   const resolvedParams = await params;
   const slug = resolvedParams?.slug;
   const subcategorySlug = resolvedParams.subcategory;

   if (!slug || !subcategorySlug) {
      return <CategoryNotFound type="service" />;
   }

   // Try fetching with full slug first (e.g., "accounting/bookkeeping")
   const fullSlug = `${slug}/${subcategorySlug}`;
   let subcategoryData = await categoriesApi.getSubcategoryBySlug(fullSlug);

   // If not found, try with just the subcategory slug
   if (!subcategoryData) {
      subcategoryData = await categoriesApi.getSubcategoryBySlug(subcategorySlug);
   }

   if (!subcategoryData) {
      return <CategoryNotFound type="service" categoryName={subcategorySlug} />;
   }

   if (!subcategoryData.isPublished) {
      console.warn(
         `Service subcategory "${subcategorySlug}" is not published. Showing anyway.`
      );
   }

   const normalizedData = normalizeIncomeOpportunitiesData(
      subcategoryData
   ) as PosterCategoryDetail;

   // Subcategory services pages are also poster-facing: reuse poster layout
   return <PosterCategoryPageClient category={normalizedData} />;
}

export async function generateMetadata({
   params,
}: ServiceSubcategoryPageProps) {
   const resolvedParams = await params;
   const slug = resolvedParams?.slug;
   const subcategorySlug = resolvedParams?.subcategory;

   const fullSlug = `${slug}/${subcategorySlug}`;
   let subcategory = await categoriesApi.getSubcategoryBySlug(fullSlug);

   if (!subcategory) {
      subcategory = await categoriesApi.getSubcategoryBySlug(subcategorySlug);
   }

   if (!subcategory) {
      return {
         title: "Page Not Found",
      };
   }

   return {
      title:
         subcategory.metaTitle ||
         subcategory.heroTitle ||
         `${subcategory.name} Services`,
      description: subcategory.metaDescription || subcategory.heroDescription,
   };
}
