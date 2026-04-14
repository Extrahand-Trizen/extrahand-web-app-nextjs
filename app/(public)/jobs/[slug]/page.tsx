import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { CategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface JobPageProps {
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

async function withSubcategoriesFromApi(
   slug: string,
   category: CategoryDetail
): Promise<CategoryDetail> {
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

export default async function JobPage({ params }: JobPageProps) {
   const { slug } = await params;

   if (!slug) {
      return <CategoryNotFound type="job" />;
   }

   const categoryData = await categoriesApi.getCategoryBySlug(slug);

   if (!categoryData) {
      console.log(`Job category with slug "${slug}" not found.`);
      return <CategoryNotFound type="job" categoryName={slug} />;
   }

   if (!categoryData.isPublished) {
      console.warn(
         `Job category "${slug}" is not published. Showing anyway in development mode.`
      );
   }

   let normalizedData = normalizeIncomeOpportunitiesData(categoryData);
   normalizedData = await withSubcategoriesFromApi(slug, normalizedData);

   return (
      <CategoryDetailClient
         category={normalizedData}
         breadcrumbCategory="Tasks"
         breadcrumbCategoryLink="/task"
      />
   );
}

export async function generateMetadata({ params }: JobPageProps) {
   const { slug } = await params;

   const category = await categoriesApi.getCategoryBySlug(slug);

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
}
