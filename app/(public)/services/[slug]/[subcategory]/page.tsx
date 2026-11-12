import React from "react";
import { notFound } from "next/navigation";
import {
   categoriesApi,
   isExcludedPublicCategorySlug,
} from "@/lib/api/endpoints/categories";
import PosterCategoryPageClient from "@/components/poster/PosterCategoryPageClient";
import { PosterCategoryDetail, SubcategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";
import {
   buildManualPosterCategoryDetail,
   getManualServiceBySlugs,
} from "@/lib/data/manual-services-catalog";
import { getSubcategoryStaticParams } from "@/lib/data/categoryStaticParams";
import { isAllowedPublicCategorySlug } from "@/lib/data/public-category-allowlist";

// Required for static export: pre-build every published /services/[category]/[subcategory].
export async function generateStaticParams() {
   return getSubcategoryStaticParams("poster");
}

// Allow un-prebuilt subcategory slugs to render on-demand via ISR
export const dynamicParams = true;

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

   const manualService = isExcludedPublicCategorySlug(slug)
      ? null
      : getManualServiceBySlugs(slug, subcategorySlug);

   if (!subcategoryData && manualService) {
      const manualCategoryDetail = buildManualPosterCategoryDetail(manualService);
      return <PosterCategoryPageClient category={manualCategoryDetail} />;
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
      const manualService = isExcludedPublicCategorySlug(slug)
         ? null
         : getManualServiceBySlugs(slug, subcategorySlug);

      if (manualService) {
         return {
            title: `${manualService.subcategoryName} | ExtraHand Services`,
            description: manualService.shortDescription,
            alternates: {
               canonical: `https://extrahand.in/services/${slug}/${subcategorySlug}`,
            },
         };
      }

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
      alternates: {
         canonical: `https://extrahand.in/services/${slug}/${subcategorySlug}`,
      },
   };
}
