import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { SubcategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface JobSubcategoryPageProps {
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

export default async function JobSubcategoryPage({
   params,
}: JobSubcategoryPageProps) {
   const resolvedParams = await params;
   const slug = resolvedParams?.slug;
   const subcategorySlug = resolvedParams.subcategory;

   if (!slug || !subcategorySlug) {
      return <CategoryNotFound type="job" />;
   }

   // Try fetching with full slug first (e.g., "accounting/bookkeeping")
   const fullSlug = `${slug}/${subcategorySlug}`;
   let subcategoryData = await categoriesApi.getSubcategoryBySlug(fullSlug);

   // If not found, try with just the subcategory slug
   if (!subcategoryData) {
      subcategoryData = await categoriesApi.getSubcategoryBySlug(subcategorySlug);
   }

   if (!subcategoryData) {
      return <CategoryNotFound type="job" categoryName={subcategorySlug} />;
   }

   if (!subcategoryData.isPublished) {
      console.warn(
         `Job subcategory "${subcategorySlug}" is not published. Showing anyway.`
      );
   }

   const normalizedData = normalizeIncomeOpportunitiesData(subcategoryData);

   return <CategoryDetailClient category={normalizedData} />;
}

export async function generateMetadata({ params }: JobSubcategoryPageProps) {
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
         `${subcategory.name} Jobs`,
      description: subcategory.metaDescription || subcategory.heroDescription,
   };
}
