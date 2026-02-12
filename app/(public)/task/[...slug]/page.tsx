import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { CategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface TaskPageProps {
   params: Promise<{
      slug: string | string[];
   }>;
}

function normalizeIncomeOpportunitiesData(
   data: CategoryDetail
): CategoryDetail {
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

export default async function TaskPage({ params }: TaskPageProps) {
   const resolved = await params;
   const slugParam = resolved.slug;
   const segments = Array.isArray(slugParam)
      ? slugParam.filter(Boolean)
      : typeof slugParam === "string"
      ? [slugParam]
      : [];
   const slug = segments[segments.length - 1] || "";
   const fullSlug = segments.join("/");

   if (!slug) {
      return <CategoryNotFound type="job" />;
   }

   // Try category first; if not found, fall back to subcategory by slug,
   // then finally by full \"category/subcategory\" slug.
   let categoryData = await categoriesApi.getCategoryBySlug(slug);
   if (!categoryData) {
      categoryData = await categoriesApi.getSubcategoryBySlug(slug);
   }
   if (!categoryData && fullSlug) {
      categoryData = await categoriesApi.getSubcategoryBySlug(fullSlug);
   }

   if (!categoryData) {
      console.log(`Job category with slug "${slug}" not found.`);
      return <CategoryNotFound type="job" categoryName={slug} />;
   }

   if (!categoryData.isPublished) {
      console.warn(
         `Job category "${slug}" is not published. Showing anyway in development mode.`
      );
   }

   const normalizedData = normalizeIncomeOpportunitiesData(categoryData);

   return (
      <CategoryDetailClient
         category={normalizedData}
         breadcrumbCategory="Tasks"
         breadcrumbCategoryLink="/task"
      />
   );
}

export async function generateMetadata({ params }: TaskPageProps) {
   const resolved = await params;
   const slugParam = resolved.slug;
   const segments = Array.isArray(slugParam)
      ? slugParam.filter(Boolean)
      : typeof slugParam === "string"
      ? [slugParam]
      : [];
   const slug = segments[segments.length - 1] || "";
   const fullSlug = segments.join("/");

   let category = slug
      ? await categoriesApi.getCategoryBySlug(slug)
      : null;

   if (!category && slug) {
      category = await categoriesApi.getSubcategoryBySlug(slug);
   }
   if (!category && fullSlug) {
      category = await categoriesApi.getSubcategoryBySlug(fullSlug);
   }

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
