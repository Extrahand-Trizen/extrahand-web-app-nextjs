import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BookNowClient from "@/components/book-now/BookNowClient";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import { filterCategoriesByRole } from "@/lib/utils/categoryRoleFilter";
import type { Category, Subcategory } from "@/types/category";

interface BookNowPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const displayedCategories = [
  { label: "Hourly Based Services", slugs: [] },
  { label: "Home Cleaning", slugs: ["cleaning-services", "home-cleaning"] },
  { label: "AC Services", slugs: ["heating-cooling-services", "ac-repair"] },
  { label: "Appliance Repair", slugs: ["appliances-services", "appliance-repair"] },
  { label: "Personal Assistance", slugs: ["admin-services", "personal-assistance"] },
  { label: "Pest Control", slugs: ["pest-control-services", "pest-control"] },
  { label: "Electrician", slugs: ["electricians-services", "electrician"] },
  { label: "Plumbing", slugs: ["plumbing-services", "plumbing"] },
];

export const metadata: Metadata = {
  title: "Book Home Services | ExtraHand",
  description:
    "Explore trusted home services on ExtraHand, compare available service types, and continue your booking in the app.",
  alternates: {
    canonical: "https://extrahand.in/book-now",
  },
  openGraph: {
    title: "Book Home Services | ExtraHand",
    description:
      "Find the right home service and complete your booking with ExtraHand.",
    url: "https://extrahand.in/book-now",
    type: "website",
  },
};

function mergeSubcategories(
  embedded: Subcategory[] | undefined,
  fetched: Subcategory[]
): Subcategory[] {
  const bySlug = new Map<string, Subcategory>();

  [...(embedded || []), ...fetched].forEach((subcategory) => {
    const key = subcategory.slug?.trim().toLowerCase();
    if (key && !bySlug.has(key)) bySlug.set(key, subcategory);
  });

  return [...bySlug.values()];
}

async function loadPublishedCategories(): Promise<Category[]> {
  const [categoryItems, allSubcategories] = await Promise.all([
    categoriesApi.getCategories({
      includeUnpublished: false,
      throwOnError: true,
    }),
    categoriesApi.getAllSubcategories({ throwOnError: true }),
  ]);

  const publishedCategories = filterCategoriesByRole(categoryItems, "poster");
  const subcategoriesByCategory = new Map<string, Subcategory[]>();

  allSubcategories.forEach((subcategory) => {
    const categorySlug = subcategory.categorySlug?.trim();
    if (!categorySlug) return;

    const current = subcategoriesByCategory.get(categorySlug) || [];
    current.push(subcategory);
    subcategoriesByCategory.set(categorySlug, current);
  });

  return displayedCategories.map((displayedCategory) => {
    const matchedCategory = publishedCategories.find((category) =>
      displayedCategory.slugs.includes(category.slug)
    );

    return {
      _id: matchedCategory?._id,
      name: displayedCategory.label,
      slug: matchedCategory?.slug || displayedCategory.slugs[0] || "hourly-based-services",
      heroImage: matchedCategory?.heroImage || "",
      heroTitle: matchedCategory?.heroTitle || "",
      heroDescription: matchedCategory?.heroDescription || "",
      subcategories: mergeSubcategories(
        matchedCategory?.subcategories,
        matchedCategory
          ? subcategoriesByCategory.get(matchedCategory.slug) || []
          : []
      ),
    };
  });
}

export default async function BookNowPage({ searchParams }: BookNowPageProps) {
  const params = await searchParams;
  if (Object.keys(params).length > 0) redirect("/book-now");

  let categories: Category[] = [];
  let catalogError = false;

  try {
    categories = await loadPublishedCategories();
  } catch (error) {
    console.error("Unable to load the Book Now service catalog:", error);
    catalogError = true;
  }

  return (
    <BookNowClient
      categories={categories}
      catalogError={catalogError}
    />
  );
}
