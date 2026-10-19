import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedSeoPage } from "@/lib/api/endpoints/seoPages";
import SeoPageRenderer from "@/components/SeoPageRenderer";
import SeoPageWrapper from "@/components/SeoPageWrapper";
import { BookServiceButton } from "@/components/shared/BookServiceButton";
import { getCityBySlug } from "@/lib/data/cities";
import { buildBookNowUrl } from "@/lib/utils/bookNowUrl";
import {
   getCategoryById,
   serviceCategories,
} from "@/lib/data/categories";
import {
   getHyderabadServicePageByLocationSlug,
   getServiceCategoryIdForPageSlug,
   hyderabadServicePages,
} from "@/lib/data/hyderabad-service-pages";

// Always server-render fresh on every request — matches how city pages work.
// This ensures newly published CMS content appears immediately after publish,
// with no stale static HTML from build time.
export const dynamic = "force-dynamic";

interface CityServicePageProps {
   params: Promise<{ city: string; category: string }>;
}

const supportedCitySlugs = ["mahabubnagar", "siddipet"];
const serviceLocationSlugs = hyderabadServicePages.map((page) =>
   page.slug.replace(/-in-hyderabad$/, "")
);
const genericCategoryIds = serviceCategories
   .filter(
      (category) => !serviceLocationSlugs.includes(category.id)
   )
   .map((category) => category.id);

function getPageData(serviceSlug: string) {
   const servicePage = getHyderabadServicePageByLocationSlug(serviceSlug);
   const categoryId = servicePage
      ? getServiceCategoryIdForPageSlug(servicePage.slug) ?? serviceSlug
      : serviceSlug;

   return {
      servicePage,
      category: getCategoryById(categoryId),
   };
}

function localize(value: string, cityName: string): string {
   return value.replaceAll("Hyderabad", cityName);
}

export async function generateMetadata({
   params,
}: CityServicePageProps): Promise<Metadata> {
   const { city: citySlug, category: serviceSlug } = await params;
   if (!supportedCitySlugs.includes(citySlug)) {
      return { title: "Service Not Found | ExtraHand" };
   }

   const cmsSlug = `${serviceSlug}-in-${citySlug}`;
   const cmsPage = await getPublishedSeoPage(cmsSlug);

   if (cmsPage) {
      return {
         title: cmsPage.metaTitle,
         description: cmsPage.metaDescription,
         alternates: { canonical: cmsPage.canonicalUrl },
         openGraph: {
            title: cmsPage.metaTitle,
            description: cmsPage.metaDescription,
            url: cmsPage.canonicalUrl,
            type: "website",
         },
      };
   }

   const city = getCityBySlug(citySlug);
   const { category, servicePage } = getPageData(serviceSlug);

   if (!city || !category || !supportedCitySlugs.includes(citySlug)) {
      return { title: "Service Not Found | ExtraHand" };
   }

   const serviceName = servicePage?.serviceName ?? category.name;

   return {
      title: `${serviceName} in ${city.name} | ExtraHand`,
      description:
         servicePage
            ? localize(servicePage.shortDescription, city.name)
            : `${category.description} in ${city.name}. Find local help with ExtraHand.`,
   };
}

export default async function CityServicePage({
   params,
}: CityServicePageProps) {
   const { city: citySlug, category: serviceSlug } = await params;
   if (!supportedCitySlugs.includes(citySlug)) {
      notFound();
   }

   const cmsSlug = `${serviceSlug}-in-${citySlug}`;
   const cmsPage = await getPublishedSeoPage(cmsSlug);

   if (cmsPage) {
      return (
         <>
            {cmsPage.faqSchema && (
               <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                     __html: JSON.stringify(cmsPage.faqSchema),
                  }}
               />
            )}
            {cmsPage.breadcrumbSchema && (
               <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                     __html: JSON.stringify(cmsPage.breadcrumbSchema),
                  }}
               />
            )}
            <SeoPageWrapper slug={cmsSlug} initialPage={cmsPage}>
               <SeoPageRenderer page={cmsPage} />
            </SeoPageWrapper>
         </>
      );
   }

   const city = getCityBySlug(citySlug);
   const { category, servicePage } = getPageData(serviceSlug);

   if (!city || !category || !supportedCitySlugs.includes(citySlug)) {
      notFound();
   }

   const serviceName = servicePage?.serviceName ?? category.name;
   const description = servicePage
      ? localize(servicePage.heroDescription, city.name)
      : `${category.description} in ${city.name}. Find trusted local professionals to help with your task.`;
   const serviceSummary = servicePage
      ? localize(servicePage.shortDescription, city.name)
      : `${category.description} in ${city.name}. Share your requirements to find local professionals for this service.`;
   const whatYouGet = servicePage?.whatYouGet ?? [
      `Help with ${category.name.toLowerCase()} tasks`,
      "Local service professionals",
      "Flexible options based on your requirements",
   ];
   const commonNeeds = servicePage?.commonNeeds ?? [
      `Finding ${category.name.toLowerCase()} help near you`,
      "Home and everyday service requests",
      "One-time or scheduled assistance",
   ];
   const faq = servicePage?.faq ?? [
      {
         question: `Can I request ${category.name.toLowerCase()} services in ${city.name}?`,
         answer: `Yes. You can share your requirements and preferred location in ${city.name} when requesting this service.`,
      },
   ];
   const trustPoints = [
      "Service information tailored to your local area",
      "Clear requirements before a booking is submitted",
      "Flexible help for home and everyday service needs",
   ];
   const prepTips = [
      `Describe the ${category.name.toLowerCase()} work you need`,
      "Share the service address and preferred time",
      "Include relevant photos or measurements when helpful",
   ];
   const afterServiceTips = [
      "Review the completed work before confirming the task",
      "Keep any care instructions provided by the professional",
      "Contact support if you need help after the service",
   ];

   return (
      <main className="min-h-screen bg-linear-to-b from-white to-secondary-50">
         <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav className="mb-8 text-sm text-secondary-600">
               <Link href="/" className="hover:text-primary-600">
                  Home
               </Link>
               <span className="mx-2">/</span>
               <Link
                  href={`/locations/${city.slug}`}
                  className="hover:text-primary-600"
               >
                  {city.name}
               </Link>
               <span className="mx-2">/</span>
               <span className="text-secondary-900">{serviceName}</span>
            </nav>

            <div className="rounded-2xl border border-secondary-200 bg-white p-6 sm:p-10">
               <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Local Services in {city.name}
               </p>
               <h1 className="mt-3 text-3xl font-bold text-secondary-900 sm:text-4xl">
                  {serviceName} in {city.name}
               </h1>
               <p className="mt-4 max-w-3xl text-base leading-7 text-secondary-700 sm:text-lg">
                  {description}
               </p>
               <p className="mt-4 max-w-3xl leading-7 text-secondary-700">
                  Find the right {serviceName.toLowerCase()} help in {city.name}.
                  Compare your options and review the details before requesting
                  a service.
               </p>
               <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                     href={`/locations/${city.slug}`}
                     className="inline-flex rounded-lg border border-secondary-300 bg-white px-5 py-3 text-sm font-semibold text-secondary-800 transition hover:bg-secondary-100"
                  >
                     Explore All Services in {city.name}
                  </Link>
                  <BookServiceButton
                     href={buildBookNowUrl()}
                     className="inline-flex rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 cursor-pointer"
                  >
                     Request This Service
                  </BookServiceButton>
               </div>
            </div>
         </section>

         <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
            <article className="rounded-2xl border border-secondary-200 bg-white p-6 sm:p-8">
               <h2 className="text-xl font-semibold text-secondary-900 sm:text-2xl">
                  Need {serviceName.toLowerCase()} in {city.name}?
               </h2>
               <p className="mt-3 leading-7 text-secondary-700">
                  {serviceSummary} Get practical help for your requirements
                  with clear details before the service begins.
               </p>
               <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                     `Local professionals for ${serviceName.toLowerCase()}`,
                     "Clear details before work begins",
                     "Support for urgent and scheduled service needs",
                  ].map((benefit) => (
                     <div
                        key={benefit}
                        className="rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-700"
                     >
                        {benefit}
                     </div>
                  ))}
               </div>
            </article>
         </section>

         <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">
                  What You Get
               </h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {whatYouGet.map((item) => (
                     <li key={item}>{localize(item, city.name)}</li>
                  ))}
               </ul>
            </article>
            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Common Service Requests
               </h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {commonNeeds.map((item) => (
                     <li key={item}>{localize(item, city.name)}</li>
                  ))}
               </ul>
            </article>
            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Why People Choose ExtraHand
               </h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {trustPoints.map((point) => (
                     <li key={point}>{point}</li>
                  ))}
               </ul>
            </article>
            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">
                  How Service Works
               </h2>
               <ol className="mt-4 list-inside list-decimal space-y-3 text-secondary-700">
                  <li>Share your {category.name.toLowerCase()} requirements.</li>
                  <li>Confirm your location and preferred schedule.</li>
                  <li>Review the service details before submitting your request.</li>
               </ol>
            </article>
            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Before You Book
               </h2>
               <p className="mt-3 text-secondary-700">
                  Sharing clear details helps local professionals understand
                  your requirements and prepare for the service.
               </p>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {prepTips.map((tip) => (
                     <li key={tip}>{tip}</li>
                  ))}
               </ul>
            </article>
            <article className="rounded-2xl border border-secondary-200 bg-white p-6">
               <h2 className="text-xl font-semibold text-secondary-900">
                  After-Service Care Tips
               </h2>
               <p className="mt-3 text-secondary-700">
                  A few follow-up steps can help you check the results and
                  maintain your service.
               </p>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {afterServiceTips.map((tip) => (
                     <li key={tip}>{tip}</li>
                  ))}
               </ul>
            </article>
            <article className="rounded-2xl border border-secondary-200 bg-white p-6 lg:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">
                  About {serviceName} in {city.name}
               </h2>
               <p className="mt-4 text-secondary-700">
                  {serviceSummary}
               </p>
               <p className="mt-3 text-secondary-700">
                  ExtraHand helps residents in {city.name} find local
                  professionals for {category.name.toLowerCase()} tasks at
                  home and for everyday needs. Describe the work, location,
                  and preferred timing when you submit a request.
               </p>
            </article>
            <article className="rounded-2xl border border-secondary-200 bg-white p-6 lg:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Frequently Asked Questions
               </h2>
               <div className="mt-4 space-y-5">
                  {faq.map((item) => (
                     <div key={item.question}>
                        <h3 className="font-semibold text-secondary-900">
                           {item.question}
                        </h3>
                        <p className="mt-1 text-secondary-700">
                           {localize(item.answer, city.name)}
                        </p>
                     </div>
                  ))}
               </div>
            </article>
         </section>
      </main>
   );
}

export function generateStaticParams() {
   return supportedCitySlugs.flatMap((city) =>
      [...serviceLocationSlugs, ...genericCategoryIds].map((category) => ({
         city,
         category,
      }))
   );
}
