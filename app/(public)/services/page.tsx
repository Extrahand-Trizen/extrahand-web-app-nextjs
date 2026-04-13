import React from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import CategoriesClient from "@/components/categories/CategoriesClient";
import { Category, Subcategory } from "@/types/category";

type MergedSubcategory = Subcategory & {
   categoryPageSlug?: string;
};

function isCarRelatedCategory(category: Category): boolean {
   const name = (category.name || "").toLowerCase();
   const slug = (category.slug || "").toLowerCase();

   return name.includes("car") || slug.includes("car-") || slug.startsWith("car");
}

function mergeCarCategories(categories: Category[]): Category[] {
   const carCategories = categories.filter(isCarRelatedCategory);

   if (carCategories.length <= 1) {
      return categories;
   }

   const mergedSubcategories: MergedSubcategory[] = [];
   const seenSubcategoryKeys = new Set<string>();
   const seenSubcategoryNames = new Set<string>();

   const canonicalCarCategory =
      carCategories.find(
         (category) => (category.slug || "").trim().toLowerCase() === "car-service-services"
      ) ||
      carCategories.find(
         (category) => (category.name || "").trim().toLowerCase() === "car service services"
      ) ||
      carCategories[0];

   carCategories.forEach((category) => {
      const sourceSubcategories = Array.isArray(category.subcategories)
         ? category.subcategories
         : [];

      sourceSubcategories.forEach((subcategory) => {
         const dedupeKey =
            (subcategory.slug || "").trim().toLowerCase() ||
            (subcategory.name || "").trim().toLowerCase();

         if (!dedupeKey || seenSubcategoryKeys.has(dedupeKey)) {
            return;
         }

         seenSubcategoryKeys.add(dedupeKey);
         seenSubcategoryNames.add((subcategory.name || "").trim().toLowerCase());
         mergedSubcategories?.push({
            ...subcategory,
            categorySlug: category.slug,
         });
      });
   });

   const requiredCarCategoryItems = [
      "car detailing services",
      "car repair services",
   ];

   requiredCarCategoryItems.forEach((requiredName) => {
      const matchedCategory = carCategories.find(
         (category) => (category.name || "").trim().toLowerCase() === requiredName
      );

      if (!matchedCategory) {
         return;
      }

      if (seenSubcategoryNames.has(requiredName)) {
         return;
      }

      seenSubcategoryNames.add(requiredName);
      mergedSubcategories?.unshift({
         name: matchedCategory.name,
         slug: matchedCategory.slug,
         categorySlug: canonicalCarCategory?.slug || matchedCategory.slug,
         categoryPageSlug: matchedCategory.slug,
      });
   });

   const mergedCarCategory: Category = {
      _id: "merged-car-services",
      name: "Car Services",
      slug: canonicalCarCategory?.slug || "",
      heroImage: canonicalCarCategory?.heroImage || "",
      heroTitle: canonicalCarCategory?.heroTitle || "",
      heroDescription: canonicalCarCategory?.heroDescription || "",
      subcategories: mergedSubcategories,
   };

   const firstCarIndex = categories.findIndex(isCarRelatedCategory);
   const withoutCarCategories = categories.filter(
      (category) => !isCarRelatedCategory(category)
   );

   const insertAt = firstCarIndex < 0 ? withoutCarCategories.length : firstCarIndex;

   return [
      ...withoutCarCategories.slice(0, insertAt),
      mergedCarCategory,
      ...withoutCarCategories.slice(insertAt),
   ];
}

/**
 * Services Page (Server Component) - For Posters looking to hire
 * Fetches categories from content-admin backend API
 */
export default async function ServicesPage() {
   let categories: Category[] = [];

   try {
      // Fetch published categories only to display to all users (both posters and guests)
      const allCategories = await categoriesApi.getCategories({
         includeUnpublished: false,
      });

      // Filter and map categories for poster view
      if (Array.isArray(allCategories)) {
         const posterCategories = allCategories
            .filter((cat: any) => {
               const type = (cat.categoryType || "").toLowerCase();
               // Show categories that are for "poster" or "both"
               return type.includes("poster") || type.includes("both") || !type;
            })
            .map((cat: any) => ({
               _id: cat._id || "",
               name: cat.name || "",
               slug: cat.slug || "",
               heroImage: cat.heroImage || "",
               heroTitle: cat.heroTitle || "",
               heroDescription: cat.heroDescription || "",
               subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : [],
            }));

         // Fallback: if embedded subcategories are empty, fetch by category slug.
         categories = await Promise.all(
            posterCategories.map(async (category) => {
               const hasEmbeddedSubcategories =
                  Array.isArray(category.subcategories) &&
                  category.subcategories.length > 0;

               if (hasEmbeddedSubcategories || !category.slug) {
                  return category;
               }

               const fetchedSubcategories = await categoriesApi.getSubcategories(
                  category.slug
               );

               return {
                  ...category,
                  subcategories: Array.isArray(fetchedSubcategories)
                     ? fetchedSubcategories
                     : [],
               };
            })
         );

         categories = mergeCarCategories(categories);
      }
   } catch (error) {
      console.error("Error fetching categories from content-admin");
   }

   return <CategoriesClient categories={categories} viewType="services" />;
}
