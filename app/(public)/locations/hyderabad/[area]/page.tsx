import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hyderabadServicePages } from "@/lib/data/hyderabad-service-pages";
import { getCityBySlug } from "@/lib/data/cities";

interface HyderabadAreaPageProps {
   params: Promise<{ area: string }>;
}

const hyderabadCity = getCityBySlug("hyderabad");
const hyderabadAreas = hyderabadCity?.neighborhoods ?? [];

function toAreaSlug(area: string) {
   return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function fromAreaSlug(areaSlug: string) {
   return hyderabadAreas.find((area) => toAreaSlug(area) === areaSlug) ?? null;
}

export async function generateStaticParams() {
   return hyderabadAreas.map((area) => ({
      area: toAreaSlug(area),
   }));
}

export async function generateMetadata({
   params,
}: HyderabadAreaPageProps): Promise<Metadata> {
   const { area } = await params;
   const areaName = fromAreaSlug(area);

   if (!areaName) {
      return {
         title: "Location Not Found | ExtraHand",
      };
   }

   return {
      title: `${areaName}, Hyderabad Services | ExtraHand`,
      description: `Explore all Hyderabad services available in ${areaName}. Find the right service and post your task quickly on ExtraHand.`,
   };
}

export default async function HyderabadAreaPage({ params }: HyderabadAreaPageProps) {
   const { area } = await params;
   const areaName = fromAreaSlug(area);

   if (!areaName) {
      notFound();
   }

   return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
         <section className="rounded-2xl border border-secondary-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
               Hyderabad Local Area
            </p>
            <h1 className="mt-2 text-2xl font-bold text-secondary-900 sm:text-3xl">
               Services in {areaName}, Hyderabad
            </h1>
            <p className="mt-3 max-w-3xl text-secondary-700">
               Demo location page for {areaName}. Service details remain the same, while titles are localized for this area.
            </p>
         </section>

         <section className="mt-8 rounded-2xl border border-secondary-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-secondary-900 sm:text-3xl">
               {areaName} Service Pages
            </h2>
            <p className="mt-3 max-w-3xl text-secondary-700">
               Explore all service-specific pages for {areaName}, Hyderabad.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
               {hyderabadServicePages.map((servicePage) => (
                  <li key={servicePage.slug}>
                     <Link
                        href={`/locations/hyderabad/${area}/${servicePage.slug}`}
                        className="block rounded-xl border border-secondary-200 bg-secondary-50 p-4 transition hover:border-primary-300 hover:bg-white"
                     >
                        <p className="text-sm font-semibold text-secondary-900">
                           {servicePage.serviceName} in {areaName}, Hyderabad
                        </p>
                        <p className="mt-1 text-xs text-secondary-700 line-clamp-2">
                           {servicePage.shortDescription}
                        </p>
                     </Link>
                  </li>
               ))}
            </ul>
         </section>
      </main>
   );
}
