import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
   getHyderabadServicePageBySlug,
   hyderabadServicePageSlugs,
} from "@/lib/data/hyderabad-service-pages";
import { getCityBySlug } from "@/lib/data/cities";

interface HyderabadAreaServicePageProps {
   params: Promise<{ area: string; serviceCitySlug: string }>;
}

const hyderabadCity = getCityBySlug("hyderabad");
const hyderabadAreas = hyderabadCity?.neighborhoods ?? [];

function toAreaSlug(area: string) {
   return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function fromAreaSlug(areaSlug: string) {
   return hyderabadAreas.find((area) => toAreaSlug(area) === areaSlug) ?? null;
}

function getDemoContent(serviceName: string, areaName: string) {
   const lowerService = serviceName.toLowerCase();
   const demoIntro = `Find the best helper for ${lowerService} in ${areaName}, Hyderabad. Compare profiles, check ratings, and book a verified worker with confidence.`;
   const ctaTitle = `Need ${lowerService} in ${areaName}?`;

   if (lowerService.includes("cleaning")) {
      return {
         demoIntro,
         ctaTitle,
         highlights: [
            "Trained cleaning workers for home and office spaces",
            "Deep cleaning focus for hygiene and freshness",
            "Easy booking with area-specific availability",
         ],
         workerCopy:
            "Choose experienced cleaning helpers who handle living rooms, kitchens, bathrooms, sofas, and high-touch areas using practical cleaning workflows.",
      };
   }

   if (lowerService.includes("repair") || lowerService.includes("electrician") || lowerService.includes("plumber")) {
      return {
         demoIntro,
         ctaTitle,
         highlights: [
            "Verified repair workers with hands-on experience",
            "Issue-first diagnosis before recommending fixes",
            "Support for urgent and scheduled service needs",
         ],
         workerCopy:
            "Get reliable workers for troubleshooting, part-level checks, and practical fixes so your service request is completed with less repeat work.",
      };
   }

   if (lowerService.includes("movers") || lowerService.includes("shifting") || lowerService.includes("relocation")) {
      return {
         demoIntro,
         ctaTitle,
         highlights: [
            "Trusted relocation workers for safe handling",
            "Packing, loading, and unloading coordination",
            "Suitable for household and office moves",
         ],
         workerCopy:
            "Book helpers who can plan move flow room-by-room, reduce handling risks, and complete shifting jobs with better coordination.",
      };
   }

   if (lowerService.includes("painting") || lowerService.includes("carpenter") || lowerService.includes("cctv")) {
      return {
         demoIntro,
         ctaTitle,
         highlights: [
            "Skilled workers for setup, installation, and finishing",
            "Best for home upgrades and maintenance jobs",
            "Flexible booking options across Hyderabad areas",
         ],
         workerCopy:
            "Connect with experienced workers for measured execution, clean output, and practical recommendations based on your property setup.",
      };
   }

   return {
      demoIntro,
      ctaTitle,
      highlights: [
         "Find trusted local helpers in minutes",
         "Book verified workers based on your requirement",
         "Fast response and clear service communication",
      ],
      workerCopy:
         "Shortlist workers by service relevance, compare options, and book the right person for your task with better confidence.",
   };
}

function buildAreaBenefits(serviceName: string, areaName: string) {
   return [
      `Find verified helpers for ${serviceName.toLowerCase()} near ${areaName} with faster response windows.`,
      "Get transparent communication on scope, visit expectations, and next steps before work starts.",
      "Book skilled workers who handle both routine and urgent requests with practical support.",
   ];
}

function buildPopularJobs(serviceName: string, commonNeeds: string[], areaName: string) {
   const generated = commonNeeds.slice(0, 3).map((need) => `${need} support in ${areaName}`);
   return generated.length > 0
      ? generated
      : [
           `${serviceName} visit in ${areaName}`,
           `Same-day ${serviceName.toLowerCase()} booking in ${areaName}`,
           `Verified ${serviceName.toLowerCase()} workers near ${areaName}`,
        ];
}

export async function generateStaticParams() {
   const params: Array<{ area: string; serviceCitySlug: string }> = [];

   for (const area of hyderabadAreas) {
      const areaSlug = toAreaSlug(area);
      for (const serviceCitySlug of hyderabadServicePageSlugs) {
         params.push({ area: areaSlug, serviceCitySlug });
      }
   }

   return params;
}

export async function generateMetadata({
   params,
}: HyderabadAreaServicePageProps): Promise<Metadata> {
   const { area, serviceCitySlug } = await params;
   const areaName = fromAreaSlug(area);
   const servicePage = getHyderabadServicePageBySlug(serviceCitySlug);

   if (!areaName || !servicePage) {
      return {
         title: "Service Page Not Found | ExtraHand",
      };
   }

   return {
      title: `${servicePage.serviceName} in ${areaName}, Hyderabad | ExtraHand`,
      description: servicePage.shortDescription.replaceAll(
         "in Hyderabad",
         `in ${areaName}, Hyderabad`
      ),
   };
}

export default async function HyderabadAreaServicePage({
   params,
}: HyderabadAreaServicePageProps) {
   const { area, serviceCitySlug } = await params;
   const areaName = fromAreaSlug(area);
   const servicePage = getHyderabadServicePageBySlug(serviceCitySlug);

   if (!areaName || !servicePage) {
      notFound();
   }

   const demoContent = getDemoContent(servicePage.serviceName, areaName);
   const areaBenefits = buildAreaBenefits(servicePage.serviceName, areaName);
   const popularJobs = buildPopularJobs(
      servicePage.serviceName,
      servicePage.commonNeeds,
      areaName
   );

   return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
         <section className="rounded-2xl border border-secondary-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
               Hyderabad Local Services
            </p>
            <h1 className="mt-2 text-2xl font-bold text-secondary-900 sm:text-3xl">
               {servicePage.serviceName} in {areaName}, Hyderabad
            </h1>
            <p className="mt-3 max-w-3xl text-secondary-700">
               {servicePage.heroDescription.replaceAll(
                  "in Hyderabad",
                  `in ${areaName}, Hyderabad`
               )}
            </p>
            <p className="mt-3 max-w-3xl text-secondary-700">{demoContent.demoIntro}</p>

            <div className="mt-6 flex flex-wrap gap-3">
               <Link
                  href={`/locations/hyderabad/${area}`}
                  className="rounded-lg border border-secondary-300 bg-white px-5 py-3 text-sm font-semibold text-secondary-800 transition hover:bg-secondary-100"
               >
                  Explore All Services in {areaName}
               </Link>
               <Link
                  href={`/${servicePage.slug}`}
                  className="rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
               >
                  Back to Hyderabad Service Page
               </Link>
            </div>
         </section>

         <section className="mt-8 grid gap-6 sm:grid-cols-2">
            <article className="rounded-2xl border border-secondary-200 bg-white p-6 sm:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">{demoContent.ctaTitle}</h2>
               <p className="mt-3 text-secondary-700">{demoContent.workerCopy}</p>
               <ul className="mt-4 grid gap-3 sm:grid-cols-3 text-secondary-700">
                  {demoContent.highlights.map((item) => (
                     <li key={item} className="rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-sm">
                        {item}
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">What You Get</h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {servicePage.whatYouGet.map((item) => (
                     <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{item}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">Common Service Requests</h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {servicePage.commonNeeds.map((item) => (
                     <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{item}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 sm:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Why Choose {servicePage.serviceName} in {areaName}
               </h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {areaBenefits.map((item) => (
                     <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{item}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 sm:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Popular {servicePage.serviceName} Jobs in {areaName}
               </h2>
               <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {popularJobs.map((job) => (
                     <p
                        key={job}
                        className="rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-sm text-secondary-800"
                     >
                        {job}
                     </p>
                  ))}
               </div>
            </article>
         </section>
      </main>
   );
}
