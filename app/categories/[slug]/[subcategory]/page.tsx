import React from "react";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import TaskSubcategory from "@/lib/models/TaskSubcategory";
import CategoryDetailClient from "@/components/categories/CategoryDetailClient";
import { SubcategoryDetail } from "@/types/category";

interface SubcategoryPageProps {
   params: Promise<{
      slug: string;
      subcategory: string;
   }>;
}

export default async function SubcategoryPage({
   params,
}: SubcategoryPageProps) {
   const resolvedParams = await params;
   const slug = resolvedParams?.slug;
   const subcategorySlug = resolvedParams.subcategory;

   if (!slug || !subcategorySlug) {
      notFound();
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
         notFound();
      }

      if (!subcategory.isPublished) {
         console.warn(
            `Subcategory "${subcategorySlug}" is not published. Showing anyway.`
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
      console.error("Error fetching subcategory:", error);
      notFound();
   }

   if (!subcategoryData) {
      notFound();
   }

   return <CategoryDetailClient category={subcategoryData} />;
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
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
            `${subcategory.name} Tasks`,
         description:
            subcategory.metaDescription || subcategory.heroDescription,
      };
   } catch {
      return {
         title: "Page Not Found",
      };
   }
}
