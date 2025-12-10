import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCityBySlug } from "@/lib/data/cities";
import { getFeaturedCategories } from "@/lib/data/categories";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { CityHero } from "@/components/locations/CityHero";
import { ServiceCategoriesGrid } from "@/components/locations/ServiceCategoriesGrid";
import { NeighborhoodsGrid } from "@/components/locations/NeighborhoodsGrid";
import { CityStats } from "@/components/locations/CityStats";

interface PageProps {
   params: Promise<{ city: string }>;
}

export async function generateMetadata({
   params,
}: PageProps): Promise<Metadata> {
   const { city } = await params;
   const cityInfo = getCityBySlug(city);

   if (!cityInfo) {
      return {
         title: "Location Not Found | ExtraHand",
      };
   }

   return {
      title: `ExtraHand ${cityInfo.name} | Find Local Taskers & Services in ${cityInfo.name}`,
      description: `Connect with verified taskers in ${cityInfo.name}, ${cityInfo.state}. ${cityInfo.description}`,
      openGraph: {
         title: `ExtraHand ${cityInfo.name} - Local Services & Tasks`,
         description: cityInfo.description,
      },
   };
}

export default async function CityPage({ params }: PageProps) {
   const { city } = await params;
   const cityInfo = getCityBySlug(city);

   // Handle city not found
   if (!cityInfo) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-secondary-50 to-primary-50">
            <div className="text-center px-4">
               <div className="text-8xl mb-6">📍</div>
               <h1 className="text-4xl font-bold text-secondary-900 mb-4">
                  City Not Found
               </h1>
               <p className="text-xl text-secondary-600 mb-8">
                  We don't have information for this location yet.
               </p>
               <Link href="/">
                  <Button
                     size="lg"
                     className="bg-primary-500 hover:bg-primary-600"
                  >
                     Return Home
                  </Button>
               </Link>
            </div>
         </div>
      );
   }

   // Get featured categories for this city
   const categories = getFeaturedCategories(12);

   return (
      <>
         <LandingHeader />
         <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <CityHero city={cityInfo} />

            {/* Service Categories */}
            <ServiceCategoriesGrid
               categories={categories}
               citySlug={cityInfo.slug}
               cityName={cityInfo.name}
            />

            {/* Stats & Trust Indicators */}
            <CityStats city={cityInfo} />

            {/* Neighborhoods */}
            <NeighborhoodsGrid
               neighborhoods={cityInfo.neighborhoods}
               citySlug={cityInfo.slug}
               cityName={cityInfo.name}
            />
         </div>
         <LandingFooter />
      </>
   );
}
