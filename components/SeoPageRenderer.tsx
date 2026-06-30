import type { SeoPage } from "@/lib/api/endpoints/seoPages";
import Link from "next/link";

interface SeoPageRendererProps {
  page: SeoPage;
}

export default function SeoPageRenderer({ page }: SeoPageRendererProps) {
  const postTaskHref = `/tasks/new?source=seo&service=${page.categorySlug}`;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="rounded-2xl border border-secondary-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              {page.pageType === "area" ? `${page.areaName}, ` : ""}{page.cityName} Local Services
            </p>
            <h1 className="mt-2 text-2xl font-bold text-secondary-900 sm:text-3xl">
              {page.heroHeading}
            </h1>
            {page.heroHeading2 && (
              <h2 className="mt-2 text-xl font-semibold text-secondary-800">
                {page.heroHeading2}
              </h2>
            )}
            <div className="mt-3 text-secondary-700" dangerouslySetInnerHTML={{ __html: page.heroDescription }} />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={postTaskHref}
                className="rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Book This Service
              </Link>
            </div>
          </div>
          {page.heroImage && (
            <div className="w-full md:w-1/3 max-w-[280px] shrink-0">
              <img 
                src={page.heroImage} 
                alt="Hero Image" 
                className="w-full h-auto rounded-xl object-contain border border-secondary-100 shadow-sm"
              />
            </div>
          )}
        </div>
      </section>

      {/* Why Choose */}
      {(page.whyChooseHeading || page.whyChooseDescription || (page.whyChoose && page.whyChoose.length > 0)) && (
        <section className="mt-8">
          {page.whyChooseHeading && <h2 className="text-xl font-bold text-secondary-900 mb-2">{page.whyChooseHeading}</h2>}
          {page.whyChooseDescription && <div className="text-secondary-700 mb-4" dangerouslySetInnerHTML={{ __html: page.whyChooseDescription }} />}
          {page.whyChoose && page.whyChoose.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {page.whyChoose.map((item, i) => (
                <article key={i} className="rounded-2xl border border-secondary-200 bg-white p-6">
                  <h3 className="text-xl font-semibold text-secondary-900">{item.label}</h3>
                  <p className="mt-3 text-secondary-700">{item.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Service Solutions */}
      {(page.serviceSolutionsHeading || (page.serviceSolutions && page.serviceSolutions.length > 0)) && (
        <section className="mt-8">
          {page.serviceSolutionsHeading && <h2 className="text-xl font-semibold text-secondary-900 mb-4">{page.serviceSolutionsHeading}</h2>}
          {page.serviceSolutions && page.serviceSolutions.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {page.serviceSolutions.map((item, i) => (
                <article key={i} className="rounded-2xl border border-secondary-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-secondary-900">{item.title}</h3>
                  <p className="mt-2 text-secondary-700">{item.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Why ExtraHand */}
      {(page.whyExtrahandHeading || page.whyExtrahandDescription || (page.whyExtrahand && page.whyExtrahand.length > 0) || page.whyExtrahandDescription2) && (
        <section className="mt-8">
          {page.whyExtrahandHeading && <h2 className="text-xl font-bold text-secondary-900 mb-2">{page.whyExtrahandHeading}</h2>}
          {page.whyExtrahandDescription && <div className="text-secondary-700 mb-4" dangerouslySetInnerHTML={{ __html: page.whyExtrahandDescription }} />}
          {page.whyExtrahand && page.whyExtrahand.length > 0 && (
            <ul className="mb-4 space-y-2 text-secondary-700">
              {page.whyExtrahand.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-2 w-2 rounded-full bg-secondary-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {page.whyExtrahandDescription2 && <div className="text-secondary-700" dangerouslySetInnerHTML={{ __html: page.whyExtrahandDescription2 }} />}
        </section>
      )}

      {/* How ExtraHand Works */}
      {page.howItWorks && page.howItWorks.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">How ExtraHand Works</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {page.howItWorks.map((step) => (
              <article key={step.step} className="rounded-2xl border border-secondary-200 bg-white p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{step.title}</h3>
                    <p className="mt-1 text-secondary-700">{step.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Benefits */}
      {page.benefits && page.benefits.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Benefits</h2>
          <ul className="space-y-3 text-secondary-700">
            {page.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Common Problems */}
      {page.commonProblems && page.commonProblems.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Common Problems</h2>
          <ul className="space-y-3 text-secondary-700">
            {page.commonProblems.map((problem, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500 shrink-0" />
                <span>{problem}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Frequently Asked Questions</h2>
          <div className="rounded-2xl border border-secondary-200 bg-white p-6">
            {page.faqs.map((faq, i) => (
              <div key={i} className={i > 0 ? "mt-4 border-t border-secondary-100 pt-4" : ""}>
                <h3 className="text-base font-semibold text-secondary-900">{faq.question}</h3>
                <p className="mt-2 text-secondary-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
