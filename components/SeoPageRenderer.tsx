"use client";

import type { SeoPage } from "@/lib/api/endpoints/seoPages";
import Link from "next/link";
import { useState } from "react";
import {
  ShieldCheck,
  MapPin,
  Tag,
  Star,
  Check,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface SeoPageRendererProps {
  page: SeoPage;
}

// Helper styling for rendering HTML text safely without the @tailwindcss/typography plugin
const richTextClasses = 
  "text-[14px] text-secondary-600 leading-relaxed " +
  "[&_p]:mb-4 [&_p]:last:mb-0 " +
  "[&_a]:text-primary-600 [&_a]:font-semibold [&_a]:underline hover:[&_a]:text-primary-700 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:mt-2 " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:mt-2 " +
  "[&_li]:mb-1.5 [&_li]:last:mb-0 " +
  "[&_strong]:font-semibold [&_strong]:text-secondary-900";

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string | null }) => (
  <div className="mb-8 border-l-4 border-primary-500 pl-4">
    <h2 className="text-2xl font-bold tracking-tight text-secondary-900 sm:text-3xl">
      {title}
    </h2>
    {subtitle && <p className="mt-2 text-sm sm:text-base text-secondary-500 font-medium">{subtitle}</p>}
  </div>
);

export default function SeoPageRenderer({ page }: SeoPageRendererProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const postTaskHref = `/tasks/new?source=seo&service=${page.categorySlug}`;

  const renderEditorialBlock = () => (
    <div className="max-w-[720px] space-y-6 text-left">
      {/* Eyebrow badge */}
      <div>
        <span className="text-[13px] font-bold uppercase tracking-wider text-primary-700">
          {page.pageType === "area" ? `${page.areaName}, ` : ""}{page.cityName} Local Services
        </span>
      </div>

      {/* H1 Heading */}
      <h1 className="text-3xl sm:text-[36px] font-extrabold tracking-tight text-secondary-900 leading-[1.15]">
        {page.heroHeading}
      </h1>

      {/* Subheading */}
      {page.heroHeading2 && (
        <p className="text-lg font-semibold leading-relaxed text-secondary-600">
          {page.heroHeading2}
        </p>
      )}

      {/* Body description */}
      <div
        className={richTextClasses}
        dangerouslySetInnerHTML={{
          __html: page.heroDescription,
        }}
      />

      {/* CTA buttons */}
      <div className="pt-2 flex flex-wrap gap-4 items-center">
        <Link
          href={postTaskHref}
          className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 font-bold text-white shadow-sm shadow-primary-600/10 hover:bg-primary-700 hover:shadow-md transition-all duration-200"
        >
          Book this service
          <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a
          href="#faq"
          className="inline-flex items-center justify-center rounded-xl border border-secondary-300 bg-white px-6 py-3.5 font-semibold text-secondary-700 shadow-2xs hover:bg-secondary-50 transition-all duration-200"
        >
          View FAQs
        </a>
      </div>

      {/* Divider line & Trust indicators */}
      <div className="mt-8 border-t border-secondary-200/50 pt-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: "Verified Pros", icon: ShieldCheck },
            { label: "Local Experts", icon: MapPin },
            { label: "Affordable Price", icon: Tag },
            { label: "Trusted Service", icon: Star },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex flex-col items-start gap-1">
                <Icon className="h-5 w-5 text-primary-600" />
                <span className="text-[12px] font-semibold text-secondary-800">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-[1300px] px-8 py-12 sm:px-10 lg:px-12 space-y-16">
      
      {/* ================= HERO SECTION (Large Image Open Layout) ================= */}
      <section className="relative overflow-hidden w-full">
        {/* Soft decorative blurred background blob */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary-100/30 blur-3xl" />
        
        <div className="relative">
          {/* Use provided hero image or fall back to the public default image */}
          {(() => {
            const heroImageSrc = page.heroImage || "/assets/images/seo/default.png";
            return (
              <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.25fr]">
                {renderEditorialBlock()}
                <div className="relative w-full">
                  <div className="relative w-full aspect-[4/3] sm:h-[320px] md:h-[480px] lg:aspect-auto lg:h-[600px] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroImageSrc}
                      alt={page.heroHeading}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      {(page.whyChooseHeading || page.whyChooseDescription || (page.whyChoose && page.whyChoose.length > 0)) && (
        <section className="space-y-6">
          <SectionHeader title={page.whyChooseHeading || "Why Choose Us"} />
          {page.whyChooseDescription && (
            <div
              className={richTextClasses}
              dangerouslySetInnerHTML={{ __html: page.whyChooseDescription }}
            />
          )}
          {page.whyChoose && page.whyChoose.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              {page.whyChoose.map((item, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-secondary-200/60 bg-white p-6 shadow-2xs hover:border-secondary-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 border border-primary-100">
                      <Check className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-secondary-900">
                        {item.label}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-secondary-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= BENEFITS INCLUDED ================= */}
      {page.benefitsIncluded && page.benefitsIncluded.length > 0 && (
        <section className="space-y-6">
          <SectionHeader title={page.benefitsIncludedHeading || "Benefits Included"} />
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {page.benefitsIncluded.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-secondary-100 bg-secondary-50/40 p-4"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm font-semibold leading-relaxed text-secondary-750">
                  {item}
                </span>
              </div>
            ))}
          </div>
          {page.benefitsIncludedDescription && (
            <div
              className={`${richTextClasses} pt-2`}
              dangerouslySetInnerHTML={{ __html: page.benefitsIncludedDescription }}
            />
          )}
        </section>
      )}

      {/* ================= SERVICE SOLUTIONS ================= */}
      {(page.serviceSolutionsHeading || (page.serviceSolutions && page.serviceSolutions.length > 0)) && (
        <section className="space-y-6">
          <SectionHeader
            title={page.serviceSolutionsHeading || "Service Solutions"}
            subtitle={page.serviceSolutionsHeading2}
          />
          {page.serviceSolutions && page.serviceSolutions.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              {page.serviceSolutions.map((item, i) => (
                <article
                  key={i}
                  className="relative rounded-2xl border border-secondary-200/60 bg-white p-6 shadow-xs transition-colors hover:border-secondary-300"
                >
                  <div className="absolute top-6 right-6 text-sm font-bold font-mono text-secondary-300/80">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 pr-8">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= WHY EXTRAHAND ================= */}
      {(page.whyExtrahandHeading ||
        page.whyExtrahandDescription ||
        (page.whyExtrahand && page.whyExtrahand.length > 0) ||
        page.whyExtrahandDescription2) && (
        <section className="space-y-6">
          <SectionHeader title={page.whyExtrahandHeading || "Why ExtraHand"} />
          {page.whyExtrahandDescription && (
            <div
              className={richTextClasses}
              dangerouslySetInnerHTML={{ __html: page.whyExtrahandDescription }}
            />
          )}

          {page.whyExtrahandBenefitsIncluded && page.whyExtrahandBenefitsIncluded.length > 0 && (
            <div className="rounded-2xl border border-secondary-200/50 bg-secondary-50/20 p-6 md:p-8 pt-2">
              {page.whyExtrahandBenefitsIncludedHeading && (
                <h3 className="mb-5 text-base font-bold text-secondary-900">
                  {page.whyExtrahandBenefitsIncludedHeading}
                </h3>
              )}
              <ul className="grid gap-4 sm:grid-cols-2">
                {page.whyExtrahandBenefitsIncluded.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-white p-4 border border-secondary-100 shadow-2xs"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-750 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-semibold leading-relaxed text-secondary-750">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              {page.whyExtrahandBenefitsIncludedDescription && (
                <div
                  className={`${richTextClasses} mt-6`}
                  dangerouslySetInnerHTML={{ __html: page.whyExtrahandBenefitsIncludedDescription }}
                />
              )}
            </div>
          )}

          {page.whyExtrahand && page.whyExtrahand.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {page.whyExtrahand.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-secondary-100 bg-white p-4 shadow-2xs"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-750 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-semibold leading-relaxed text-secondary-750">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          {page.whyExtrahandDescription2 && (
            <div
              className={`${richTextClasses} pt-2`}
              dangerouslySetInnerHTML={{ __html: page.whyExtrahandDescription2 }}
            />
          )}
        </section>
      )}

      {/* ================= HOW IT WORKS ================= */}
      {page.howItWorks && page.howItWorks.length > 0 && (
        <section className="space-y-6">
          <SectionHeader title="How ExtraHand Works" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {page.howItWorks.map((step) => (
              <article
                key={step.step}
                className="relative rounded-2xl border border-secondary-200/60 bg-white p-6 shadow-2xs hover:border-secondary-300 transition-colors"
              >
                <div className="absolute top-6 right-6 text-4xl font-extrabold text-secondary-100/70 leading-none select-none">
                  {String(step.step).padStart(2, "0")}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-secondary-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-secondary-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ================= BENEFITS ================= */}
      {(page.benefitsHeading ||
        page.benefitsDescription ||
        (page.benefits && page.benefits.length > 0)) && (
        <section className="space-y-6">
          <SectionHeader title={page.benefitsHeading || "Benefits"} />
          {page.benefitsDescription && !page.benefitsOnlyPoints && (
            <div
              className={richTextClasses}
              dangerouslySetInnerHTML={{ __html: page.benefitsDescription }}
            />
          )}
          {page.benefits && page.benefits.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2 pt-2">
              {page.benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl border border-secondary-100 bg-secondary-50/40 p-4"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-750 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span
                    className="text-sm font-semibold leading-relaxed text-secondary-750"
                    dangerouslySetInnerHTML={{ __html: benefit }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ================= COMMON PROBLEMS ================= */}
      {page.commonProblems && page.commonProblems.length > 0 && (
        <section className="space-y-6">
          <SectionHeader title="Common Problems" />
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {page.commonProblems.map((problem, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 rounded-xl border border-amber-100 bg-amber-50/20 p-4"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold leading-relaxed text-secondary-750">
                  {problem}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= FAQ ================= */}
      {page.faqs && page.faqs.length > 0 && (
        <section id="faq" className="space-y-6">
          <SectionHeader title="Frequently Asked Questions" />
          <div className="space-y-4 pt-2">
            {page.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? "border-primary-350 bg-primary-50/10 shadow-2xs"
                      : "border-secondary-200 hover:border-secondary-300 bg-white"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left transition-colors hover:bg-secondary-50/30 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold shrink-0 transition-colors ${
                          isOpen
                            ? "bg-primary-500 text-white"
                            : "bg-secondary-100 text-secondary-600"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base font-semibold text-secondary-900">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-secondary-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary-600" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-secondary-100 px-6 py-5 bg-white">
                        <p className="text-sm leading-relaxed text-secondary-655">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
