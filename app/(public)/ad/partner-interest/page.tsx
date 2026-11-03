import type { Metadata } from "next";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import PartnerCallbackForm from "../PartnerCallbackForm";

const CONTENT_ADMIN_URL =
   process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
   "https://extrahand-content-admin-backend.backend.extrahand.in";

export const metadata: Metadata = {
   title: "Partner Interest | ExtraHand",
   description: "Share your details and our team will contact you about becoming an ExtraHand partner.",
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

export default async function PartnerInterestPage() {
   const [categories, cities] = await Promise.all([
      categoriesApi.getCategories(),
      getActiveCities(),
   ]);

   return <PartnerCallbackForm categories={categories} cities={cities} />;
}
