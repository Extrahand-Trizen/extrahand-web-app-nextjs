import type { Metadata } from "next";
import { categoriesApi, type CategoriesListItem } from "@/lib/api/endpoints/categories";
import { partnerPlayStoreUrl } from "@/lib/data/partner-interest";
import AdLandingClient from "./AdLandingClient";

const featuredCategories = [
   {
      name: "Home Cleaning",
      slugs: ["cleaning-services", "home-cleaning"],
      image: "/assets/Book-now/fullhouse-booknow.webp",
   },
   {
      name: "AC Services",
      slugs: ["heating-cooling-services", "ac-repair"],
      image: "/assets/Book-now/acrepair-booknow.webp",
   },
   {
      name: "Appliance Repair",
      slugs: ["appliances-services", "appliance-repair"],
      image: "/assets/Book-now/wachingmachinecheckup-booknow.webp",
   },
   {
      name: "Personal Assistance",
      slugs: ["admin-services", "personal-assistance"],
      image: "/assets/Book-now/personal-assistance_card.webp",
   },
   {
      name: "Pest Control",
      slugs: ["pest-control-services", "pest-control"],
      image: "/assets/Book-now/Pest-Control_card.webp",
   },
   {
      name: "Electrical",
      slugs: ["electricians-services", "electrician"],
      image: "/assets/Book-now/electrician-switch-socket.webp",
   },
   {
      name: "Plumbing",
      slugs: ["plumbing-services", "plumbing"],
      image: "/assets/Book-now/plumbing-tap-mixer.webp",
   },
] as const;

const CONTENT_ADMIN_URL =
   process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
   "https://extrahand-content-admin-backend.backend.extrahand.in";

export const revalidate = 3600;

export const metadata: Metadata = {
   title: "ExtraHand | Home Services & Partner Opportunities",
   description:
      "Book trusted home services or grow your service business with ExtraHand. Explore services and register as a service partner.",
};

async function getActiveCities(): Promise<string[]> {
   try {
      const response = await fetch(`${CONTENT_ADMIN_URL}/api/cities`, {
         next: { revalidate: 3600 },
      });

      if (!response.ok) {
         throw new Error(`Cities API returned ${response.status}`);
      }

      const cities: Array<{ name?: string; isActive?: boolean }> = await response.json();
      return Array.isArray(cities)
         ? cities
              .filter((city) => city.isActive !== false && typeof city.name === "string")
              .map((city) => city.name!.trim())
              .filter(Boolean)
         : [];
   } catch (error) {
      console.error("Unable to load active service cities:", error);
      return [];
   }
}

export default async function AdvertisingLandingPage() {
   const [availableCategories, cities] = await Promise.all([
      categoriesApi.getCategories(),
      getActiveCities(),
   ]);
   const categories: CategoriesListItem[] = featuredCategories.map((featured) => {
      const activeCategory = availableCategories.find((category) =>
         featured.slugs.some((slug) => slug === category.slug)
      );

      return {
         name: featured.name,
         slug: activeCategory?.slug || featured.slugs[0],
         heroImage: featured.image,
         heroTitle: "",
         heroDescription: "",
      };
   });

   return (
      <AdLandingClient
         categories={categories}
         cities={cities}
         partnerPlayStoreUrl={partnerPlayStoreUrl}
      />
   );
}
