import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
   getHyderabadServicePageBySlug,
   hyderabadServicePageSlugs,
} from "@/lib/data/hyderabad-service-pages";
import { getCityBySlug } from "@/lib/data/cities";
import { getPublishedSeoPage } from "@/lib/api/endpoints/seoPages";
import SeoPageRenderer from "@/components/SeoPageRenderer";
import SeoPageWrapper from "@/components/SeoPageWrapper";

interface HyderabadAreaServicePageProps {
   params: Promise<{ area: string; serviceCitySlug: string }>;
}

const hyderabadCity = getCityBySlug("hyderabad");
const hyderabadAreas = hyderabadCity?.neighborhoods ?? [];

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in";

/**
 * Build the full absolute canonical URL for a /locations/hyderabad/[area]/[serviceCitySlug] page.
 *
 * City/area service pages use a trailing slash by default, e.g.:
 *   https://extrahand.in/locations/hyderabad/gachibowli/ac-repair-in-hyderabad/
 * Three legacy canonical URLs are kept without a trailing slash.
 *
 * A full absolute URL is returned so Next.js (trailingSlash: false) does not
 * strip or alter it during metadata normalisation.
 */
function buildCanonicalAreaUrl(area: string, serviceCitySlug: string): string {
   const path = `/locations/hyderabad/${area}/${serviceCitySlug}`;
   const noTrailingSlashPaths = new Set([
      "/locations/hyderabad/secunderabad/kitchen-cleaning-in-hyderabad",
      "/locations/hyderabad/begumpet/driver-services-in-hyderabad",
      "/locations/hyderabad/madhapur/fitness-trainers-in-hyderabad",
      "/locations/hyderabad/miyapur/office-relocation-in-hyderabad",
      "/locations/hyderabad/begumpet/fitness-trainers-in-hyderabad",
   ]);

   return `${BASE_URL}${path}${noTrailingSlashPaths.has(path) ? "" : "/"}`;
}

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
         const categorySlugPart = serviceCitySlug.replace(/-in-hyderabad$/, "");
         params.push({ area: areaSlug, serviceCitySlug: `${categorySlugPart}-in-${areaSlug}` });
      }
   }

   return params;
}

function parseAreaServiceSlug(serviceCitySlug: string, area: string) {
   let categorySlugPart = serviceCitySlug;
   if (categorySlugPart.endsWith("-in-hyderabad")) {
      categorySlugPart = categorySlugPart.replace(/-in-hyderabad$/, "");
   } else if (categorySlugPart.endsWith(`-in-${area}`)) {
      categorySlugPart = categorySlugPart.replace(new RegExp(`-in-${area}$`), "");
   } else {
      categorySlugPart = categorySlugPart.replace(/-in-[a-z0-9-]+$/, "");
   }

   const canonicalHyderabadSlug = `${categorySlugPart}-in-hyderabad`;
   const areaSlug = `${categorySlugPart}-in-${area}`;

   return { categorySlugPart, canonicalHyderabadSlug, areaSlug };
}

export async function generateMetadata({
   params,
}: HyderabadAreaServicePageProps): Promise<Metadata> {
   const { area, serviceCitySlug } = await params;
   const { canonicalHyderabadSlug, areaSlug } = parseAreaServiceSlug(serviceCitySlug, area);

   const areaCanonicalUrl = buildCanonicalAreaUrl(area, canonicalHyderabadSlug);

   const cmsPage = await getPublishedSeoPage(areaSlug);
   if (cmsPage) {
      return {
         title: cmsPage.metaTitle,
         description: cmsPage.metaDescription,
         alternates: { canonical: areaCanonicalUrl },
         openGraph: {
            title: cmsPage.metaTitle,
            description: cmsPage.metaDescription,
            url: areaCanonicalUrl,
            type: "website",
         },
         twitter: {
            card: "summary_large_image",
            title: cmsPage.metaTitle,
            description: cmsPage.metaDescription,
         },
      };
   }

   const areaName = fromAreaSlug(area);
   const servicePage =
      getHyderabadServicePageBySlug(serviceCitySlug) ??
      getHyderabadServicePageBySlug(canonicalHyderabadSlug);

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
      alternates: { canonical: areaCanonicalUrl },
      openGraph: {
         title: `${servicePage.serviceName} in ${areaName}, Hyderabad`,
         description: servicePage.shortDescription.replaceAll(
            "in Hyderabad",
            `in ${areaName}, Hyderabad`
         ),
         url: areaCanonicalUrl,
         type: "website",
      },
      twitter: {
         card: "summary_large_image",
         title: `${servicePage.serviceName} in ${areaName}, Hyderabad | ExtraHand`,
         description: servicePage.shortDescription.replaceAll(
            "in Hyderabad",
            `in ${areaName}, Hyderabad`
         ),
      },
   };
}

export default async function HyderabadAreaServicePage({
   params,
}: HyderabadAreaServicePageProps) {
   const { area, serviceCitySlug } = await params;
   const { canonicalHyderabadSlug, areaSlug } = parseAreaServiceSlug(serviceCitySlug, area);

   const cmsPage = await getPublishedSeoPage(areaSlug);
   const areaName = fromAreaSlug(area);
   const servicePage =
      getHyderabadServicePageBySlug(serviceCitySlug) ??
      getHyderabadServicePageBySlug(canonicalHyderabadSlug);

   // If neither CMS page nor static data found, 404
   if (!cmsPage && (!areaName || !servicePage)) {
      notFound();
   }

   const staticFallback =
      areaName && servicePage ? (() => {
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
      })() : null;

   return (
      <>
         {/* JSON-LD schemas in server component = baked into static HTML at build time */}
         {cmsPage?.faqSchema && (
            <script
               type="application/ld+json"
               dangerouslySetInnerHTML={{ __html: JSON.stringify(cmsPage.faqSchema) }}
            />
         )}
         {cmsPage?.breadcrumbSchema && (
            <script
               type="application/ld+json"
               dangerouslySetInnerHTML={{ __html: JSON.stringify(cmsPage.breadcrumbSchema) }}
            />
         )}
         <SeoPageWrapper slug={areaSlug} initialPage={cmsPage}>
            {staticFallback}
         </SeoPageWrapper>
      </>
   );
}
