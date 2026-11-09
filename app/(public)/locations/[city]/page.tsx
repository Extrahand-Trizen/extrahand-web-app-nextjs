import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Construction, MapPin } from "lucide-react";
import { NeedHelpSection } from "@/components/shared/NeedHelpSection";
import { getCityBySlug, getAllCitySlugs } from "@/lib/data/cities";
import { getFeaturedCategories } from "@/lib/data/categories";
import {
   getCityPageDefaultContent,
   mergeCityPageContent,
} from "@/lib/data/city-page-content";
import { getPublishedCityPage } from "@/lib/api/endpoints/cityPages";
import { CityHero } from "@/components/locations/CityHero";
import { ServiceCategoriesGrid } from "@/components/locations/ServiceCategoriesGrid";
import { CityStats } from "@/components/locations/CityStats";
import { hyderabadServicePages } from "@/lib/data/hyderabad-service-pages";
import { FAQSection } from "@/components/landing/FAQSection";

interface PageProps {
   params: Promise<{ city: string }>;
}

const COMING_SOON_CITY_SLUGS = [
   "delhi",
   "mumbai",
   "bangalore",
   "chennai",
   "kolkata",
   "pune",
   "ahmedabad",
];

export const dynamic = "force-dynamic";

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

   if (COMING_SOON_CITY_SLUGS.includes(cityInfo.slug)) {
      return {
         title: `${cityInfo.name} Coming Soon | ExtraHand`,
         description: `ExtraHand is coming soon to ${cityInfo.name}. Please check back soon.`,
      };
   }

   const defaults = getCityPageDefaultContent(cityInfo);
   const published = await getPublishedCityPage(cityInfo.slug);
   const content = published
      ? mergeCityPageContent(defaults, published.content)
      : defaults;

   return {
      title: content.seo.metaTitle,
      description: content.seo.metaDescription,
      alternates: content.seo.canonicalUrl
         ? { canonical: content.seo.canonicalUrl }
         : undefined,
      openGraph: {
         title: content.seo.ogTitle,
         description: content.seo.ogDescription,
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
                  We don&apos;t have information for this location yet.
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

   if (COMING_SOON_CITY_SLUGS.includes(cityInfo.slug)) {
      return (
         <main className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden bg-linear-to-br from-amber-50 via-white to-orange-50 px-4 py-16 sm:px-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
               <div className="absolute -left-24 top-8 size-72 rounded-full bg-amber-200/30 blur-3xl" />
               <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-orange-200/30 blur-3xl" />
            </div>
            <div className="relative w-full max-w-3xl rounded-3xl border border-white/80 bg-white/80 px-6 py-12 text-center shadow-xl shadow-amber-900/5 backdrop-blur-sm sm:px-12 sm:py-16">
               <div className="mx-auto mb-7 flex size-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 shadow-inner shadow-amber-200/60">
                  <Construction className="size-9" aria-hidden="true" />
               </div>
               <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-sm font-semibold text-amber-800">
                  <MapPin className="size-4" aria-hidden="true" />
                  <span>Our next destination</span>
               </div>
               <h1 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
                  {cityInfo.name}, we&apos;re on our way.
               </h1>
               <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-secondary-600 sm:text-lg">
                  We&apos;re getting ready to bring ExtraHand to {cityInfo.name}. Check back soon to find trusted local help for the things that matter.
               </p>
               <div className="mt-9 flex justify-center">
                  <Link href="/">
                     <Button size="lg" className="gap-2 bg-primary-500 font-semibold text-secondary-900 shadow-sm hover:bg-primary-600">
                        Explore ExtraHand
                        <ArrowRight className="size-4" aria-hidden="true" />
                     </Button>
                  </Link>
               </div>
            </div>
         </main>
      );
   }

   // Get featured categories for this city
   const defaults = getCityPageDefaultContent(cityInfo);
   const published = await getPublishedCityPage(cityInfo.slug);
   const content = published
      ? mergeCityPageContent(defaults, published.content)
      : defaults;
   const categoryCopy = new Map(
      content.popularServices.items.map((item) => [item.id, item])
   );
   const categories = getFeaturedCategories(12).map((category) => {
      const copy = categoryCopy.get(category.id);
      return copy
         ? { ...category, name: copy.name, description: copy.description }
         : category;
   });

   const renderSection = (sectionKey: string) => {
      if (sectionKey.startsWith("seo:")) {
         const blockId = sectionKey.slice(4);
         const block = content.seoContentBlocks.find(
            (item) => item.id === blockId
         );
         if (!block) return null;

         return (
            <section className="mx-auto w-full max-w-7xl rounded-lg border border-gray-200 px-4 py-12 sm:px-6 lg:px-8">
               <article>
                  {block.title ? (
                     <h2 className="text-2xl font-bold text-secondary-900 sm:text-3xl">
                        {block.title}
                     </h2>
                  ) : null}
                  <div className="city-page-rich-content">
                     {block.type === "faq" ? (
                        <div className="space-y-4">
                           {block.faqs?.map((faq) => (
                              <div key={faq.id}>
                                 <h3>{faq.question}</h3>
                                 <p>{faq.answer}</p>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div dangerouslySetInnerHTML={{ __html: block.html }} />
                     )}
                  </div>
               </article>
            </section>
         );
      }

      switch (sectionKey) {
         case "hero":
            return <CityHero city={cityInfo} content={content.hero} />;
         case "popularServices":
            return (
               <ServiceCategoriesGrid
                  categories={categories}
                  citySlug={cityInfo.slug}
                  cityName={cityInfo.name}
                  content={content.popularServices}
               />
            );
         case "howItWorks":
            return (
               <CityStats
                  city={cityInfo}
                  howItWorks={content.howItWorks}
                  section="howItWorks"
               />
            );
         case "stats":
            return (
               <CityStats
                  city={cityInfo}
                  statsTitle={content.stats.title}
                  section="stats"
               />
            );
         case "neighborhoods":
            return <FAQSection includeExtraMart={false} />;
         case "exploreServices":
            if (
               cityInfo.slug !== "hyderabad" &&
               cityInfo.slug !== "mahabubnagar" &&
               cityInfo.slug !== "siddipet"
            ) {
               return null;
            }
            return (
               <section
                  id={
                     cityInfo.slug === "hyderabad"
                        ? "hyderabad-service-pages"
                        : "city-service-pages"
                  }
                  className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
               >
                  <div className="rounded-2xl border border-secondary-200 bg-white p-6 sm:p-8">
                     <h2 className="text-2xl font-bold text-secondary-900 sm:text-3xl">
                        {content.exploreServices.title}
                     </h2>
                     <p className="mt-3 max-w-3xl text-secondary-700">
                        {content.exploreServices.subtitle}
                     </p>

                     <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {hyderabadServicePages.map((servicePage) => {
                           const copy = content.exploreServices.items.find(
                              (item) => item.id === servicePage.slug
                           );
                           return (
                              <li key={servicePage.slug}>
                                 <Link
                                    href={
                                       cityInfo.slug === "hyderabad"
                                          ? `/${servicePage.slug}`
                                          : `/${servicePage.slug.replace(/-in-hyderabad$/, "")}-in-${cityInfo.slug}`
                                    }
                                    className="block rounded-xl border border-secondary-200 bg-secondary-50 p-4 transition hover:border-primary-300 hover:bg-white"
                                 >
                                    <p className="text-sm font-semibold text-secondary-900">
                                       {copy?.title ??
                                          `${servicePage.serviceName} in ${cityInfo.name}`}
                                    </p>
                                    <p className="mt-1 text-xs text-secondary-700 line-clamp-2">
                                       {copy?.description ??
                                          servicePage.shortDescription.replaceAll(
                                             "Hyderabad",
                                             cityInfo.name
                                          )}
                                    </p>
                                 </Link>
                              </li>
                           );
                        })}
                     </ul>
                  </div>
               </section>
            );
         default:
            return null;
      }
   };

   return (
      <>
         <link
            rel="preload"
            as="image"
            href={content.hero.image}
            fetchPriority="high"
         />
         <main>
            {content.sectionOrder.map((sectionKey) => (
               <Fragment key={sectionKey}>
                  {renderSection(sectionKey)}
               </Fragment>
            ))}
            <NeedHelpSection />
         </main>
      </>
   );
}

export async function generateStaticParams() {
   const slugs = getAllCitySlugs();
   return slugs.map((slug) => ({
      city: slug,
   }));
}
