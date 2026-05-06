import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCityBySlug } from "@/lib/data/cities";
import { getFeaturedCategories } from "@/lib/data/categories";
import { CityHero } from "@/components/locations/CityHero";
import { ServiceCategoriesGrid } from "@/components/locations/ServiceCategoriesGrid";
import { NeighborhoodsGrid } from "@/components/locations/NeighborhoodsGrid";
import { CityStats } from "@/components/locations/CityStats";
import { hyderabadServicePages } from "@/lib/data/hyderabad-service-pages";

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
      title: `ExtraHand ${cityInfo.name} | Find Local Helpers & Services in ${cityInfo.name}`,
      description: `Connect with verified helpers in ${cityInfo.name}, ${cityInfo.state}. ${cityInfo.description}`,
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
         <main>
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

            {cityInfo.slug === "hyderabad" && (
               <section
                  id="hyderabad-service-pages"
                  className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
               >
                  <div className="rounded-2xl border border-secondary-200 bg-white p-6 sm:p-8">
                     <h2 className="text-2xl font-bold text-secondary-900 sm:text-3xl">
                        Explore Services in Hyderabad
                     </h2>
                     <p className="mt-3 max-w-3xl text-secondary-700">
                        Explore all service-specific pages for Hyderabad. Each page includes focused content to help users quickly find the right service.
                     </p>

                     <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {hyderabadServicePages.map((servicePage) => (
                           <li key={servicePage.slug}>
                              <Link
                                 href={`/${servicePage.slug}`}
                                 className="block rounded-xl border border-secondary-200 bg-secondary-50 p-4 transition hover:border-primary-300 hover:bg-white"
                              >
                                 <p className="text-sm font-semibold text-secondary-900">
                                    {servicePage.serviceName} in Hyderabad
                                 </p>
                                 <p className="mt-1 text-xs text-secondary-700 line-clamp-2">
                                    {servicePage.shortDescription}
                                 </p>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               </section>
            )}
         </main>
      </>
   );
}

