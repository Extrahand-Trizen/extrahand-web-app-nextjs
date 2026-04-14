import type { Category, Subcategory } from "@/types/category";

type MergedSubcategory = Subcategory & {
   categoryPageSlug?: string;
};

export function isCarRelatedCategory(category: Category): boolean {
   const name = (category.name || "").toLowerCase();
   const slug = (category.slug || "").toLowerCase();

   return name.includes("car") || slug.includes("car-") || slug.startsWith("car");
}

/**
 * Collapses multiple car-related top-level categories into one "Car Services" group
 * (same behavior as /services page) so nav and listing stay aligned.
 */
export function mergeCarCategories(categories: Category[]): Category[] {
   const carCategories = categories.filter(isCarRelatedCategory);

   if (carCategories.length <= 1) {
      return categories;
   }

   const mergedSubcategories: MergedSubcategory[] = [];
   const seenSubcategoryKeys = new Set<string>();
   const seenSubcategoryNames = new Set<string>();

   const canonicalCarCategory =
      carCategories.find(
         (category) =>
            (category.slug || "").trim().toLowerCase() === "car-service-services"
      ) ||
      carCategories.find(
         (category) =>
            (category.name || "").trim().toLowerCase() === "car service services"
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
         mergedSubcategories.push({
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
         (category) =>
            (category.name || "").trim().toLowerCase() === requiredName
      );

      if (!matchedCategory) {
         return;
      }

      if (seenSubcategoryNames.has(requiredName)) {
         return;
      }

      seenSubcategoryNames.add(requiredName);
      mergedSubcategories.unshift({
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

   const insertAt =
      firstCarIndex < 0 ? withoutCarCategories.length : firstCarIndex;

   return [
      ...withoutCarCategories.slice(0, insertAt),
      mergedCarCategory,
      ...withoutCarCategories.slice(insertAt),
   ];
}
