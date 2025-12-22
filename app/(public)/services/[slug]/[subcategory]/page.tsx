import React from "react";
import connectDB from "@/lib/mongodb";
import TaskSubcategory from "@/lib/models/TaskSubcategory";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { SubcategoryDetail } from "@/types/category";
import { CategoryNotFound } from "@/components/shared/CategoryNotFound";

interface ServiceSubcategoryPageProps {
   params: Promise<{
      slug: string;
      subcategory: string;
   }>;
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

   let subcategoryData: SubcategoryDetail | null = null;

   try {
      await connectDB();

      const fullSlug = `${slug}/${subcategorySlug}`;

      let subcategory = await TaskSubcategory.findOne({
         slug: fullSlug,
      } as any).lean();

      if (!subcategory) {
         subcategory = await TaskSubcategory.findOne({
            slug: subcategorySlug,
            categorySlug: slug,
         } as any).lean();
      }

      if (!subcategory) {
         return (
            <CategoryNotFound type="service" categoryName={subcategorySlug} />
         );
      }

      if (!subcategory.isPublished) {
         console.warn(
            `Service subcategory "${subcategorySlug}" is not published. Showing anyway.`
         );
      }

      subcategoryData = JSON.parse(
         JSON.stringify(subcategory)
      ) as SubcategoryDetail;

      if (subcategoryData.incomeOpportunitiesData) {
         if (!Array.isArray(subcategoryData.incomeOpportunitiesData.weekly)) {
            subcategoryData.incomeOpportunitiesData.weekly = [];
         }
         if (!Array.isArray(subcategoryData.incomeOpportunitiesData.monthly)) {
            subcategoryData.incomeOpportunitiesData.monthly = [];
         }
         if (!Array.isArray(subcategoryData.incomeOpportunitiesData.yearly)) {
            subcategoryData.incomeOpportunitiesData.yearly = [];
         }
      }
   } catch (error) {
      console.error("Error fetching service subcategory:", error);
      return <CategoryNotFound type="service" categoryName={subcategorySlug} />;
   }

   if (!subcategoryData) {
      return <CategoryNotFound type="service" categoryName={subcategorySlug} />;
   }

   return <CategoryDetailClient category={subcategoryData} />;
}

export async function generateMetadata({
   params,
}: ServiceSubcategoryPageProps) {
   const resolvedParams = await params;
   const slug = resolvedParams?.slug;
   const subcategorySlug = resolvedParams?.subcategory;

   try {
      await connectDB();
      const fullSlug = `${slug}/${subcategorySlug}`;
      const subcategory = await TaskSubcategory.findOne({
         slug: fullSlug,
      } as any);

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
         description:
            subcategory.metaDescription || subcategory.heroDescription,
      };
   } catch {
      return {
         title: "Page Not Found",
      };
   }
}

