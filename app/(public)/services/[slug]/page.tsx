import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import PosterCategoryPageClient from "@/components/poster/PosterCategoryPageClient";
import { CategoryDetail, PosterCategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";
import {
   buildManualPosterCategoryOverview,
   getManualServicesByCategorySlug,
} from "@/lib/data/manual-services-catalog";

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

/** Same as /services index: detail API often omits subs — load from task-subcategories. */
async function withSubcategoriesFromApi(
   slug: string,
   category: PosterCategoryDetail
): Promise<PosterCategoryDetail> {
   const embedded = category.subcategories;
   if (Array.isArray(embedded) && embedded.length > 0) {
      return category;
   }
   const fetched = await categoriesApi.getSubcategories(slug);
   return {
      ...category,
      subcategories: Array.isArray(fetched) ? fetched : [],
   };
}

export default async function ServicePage({ params }: ServicePageProps) {
   const { slug } = await params;

   if (!slug) {
      return <CategoryNotFound type="service" />;
   }

   const categoryData = await categoriesApi.getCategoryBySlug(slug);

   if (!categoryData) {
      const manualServices = getManualServicesByCategorySlug(slug);

      if (manualServices.length > 0) {
         const manualOverview = buildManualPosterCategoryOverview(slug);

         if (manualOverview) {
            return <PosterCategoryPageClient category={manualOverview} />;
         }
      }

      console.log(`Service category with slug "${slug}" not found.`);
      return <CategoryNotFound type="service" categoryName={slug} />;
   }

   if (!categoryData.isPublished) {
      console.warn(
         `Service category "${slug}" is not published. Showing anyway in development mode.`
      );
   }

   let normalizedData = normalizeIncomeOpportunitiesData(
      categoryData
   ) as PosterCategoryDetail;
   normalizedData = await withSubcategoriesFromApi(slug, normalizedData);

   // Services pages are poster-facing by design: always use the poster category layout
   return <PosterCategoryPageClient category={normalizedData} />;
}

export async function generateMetadata({ params }: ServicePageProps) {
   const { slug } = await params;

   const category = await categoriesApi.getCategoryBySlug(slug);

   if (!category) {
      const manualServices = getManualServicesByCategorySlug(slug);

      if (manualServices.length > 0) {
         return {
            title: `${manualServices[0].categoryName} | ExtraHand Services`,
            description: `Find ${manualServices[0].categoryName.toLowerCase()} on ExtraHand with full service details and booking support.`,
         };
      }

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
