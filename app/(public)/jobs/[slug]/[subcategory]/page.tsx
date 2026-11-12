import React from "react";
import { notFound } from "next/navigation";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { SubcategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";
import { getSubcategoryStaticParams } from "@/lib/data/categoryStaticParams";
import { isAllowedPublicCategorySlug } from "@/lib/data/public-category-allowlist";

export async function generateStaticParams() {
   return getSubcategoryStaticParams("tasker");
}

// Allow un-prebuilt subcategory slugs to render on-demand via ISR
export const dynamicParams = true;

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

   if (!isAllowedPublicCategorySlug(slug)) {
      notFound();
   }

   // Try fetching with full slug first (e.g., "accounting/bookkeeping")
   const fullSlug = `${slug}/${subcategorySlug}`;
   let subcategoryData = await categoriesApi.getSubcategoryBySlug(fullSlug, slug);

   // If not found, try with just the subcategory slug
   if (!subcategoryData) {
      subcategoryData = await categoriesApi.getSubcategoryBySlug(
         subcategorySlug,
         slug
      );
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

   if (!isAllowedPublicCategorySlug(slug)) {
      return {
         title: "Page Not Found",
      };
   }

   const fullSlug = `${slug}/${subcategorySlug}`;
   let subcategory = await categoriesApi.getSubcategoryBySlug(fullSlug, slug);

   if (!subcategory) {
      subcategory = await categoriesApi.getSubcategoryBySlug(
         subcategorySlug,
         slug
      );
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
      alternates: {
         canonical: `https://extrahand.in/jobs/${slug}/${subcategorySlug}`,
      },
   };
}
