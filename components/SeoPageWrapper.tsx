"use client";

import React, { useEffect, useState } from "react";
import { getPublishedSeoPage, type SeoPage } from "@/lib/api/endpoints/seoPages";
import SeoPageRenderer from "@/components/SeoPageRenderer";

interface SeoPageWrapperProps {
  slug: string;
  initialPage?: SeoPage | null;
  children: React.ReactNode;
}

/**
 * SeoPageWrapper — client component that:
 *  1. Renders CMS SeoPageRenderer if a page is available (either from SSG or client fetch)
 *  2. Falls back to static `children` if no CMS page is found
 *
 * NOTE: JSON-LD schema <script> tags are intentionally NOT rendered here.
 * They must be rendered in the parent server component so they appear in the
 * initial static HTML (required for SEO / Google Rich Results).
 */
export default function SeoPageWrapper({
  slug,
  initialPage = null,
  children,
}: SeoPageWrapperProps) {
  const [cmsPage, setCmsPage] = useState<SeoPage | null>(initialPage);

  useEffect(() => {
    // If initialPage was already provided by SSR/SSG, skip redundant client-side refetch
    if (initialPage) return;

    let isMounted = true;
    getPublishedSeoPage(slug).then((fetchedPage) => {
      if (isMounted && fetchedPage) {
        setCmsPage(fetchedPage);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, initialPage]);

  if (cmsPage) {
    return (
      <>
        {/* Render JSON-LD schemas dynamically in the browser only if they were not pre-rendered in static HTML */}
        {!initialPage && cmsPage.faqSchema && (
          <script
             type="application/ld+json"
             dangerouslySetInnerHTML={{ __html: JSON.stringify(cmsPage.faqSchema) }}
          />
        )}
        {!initialPage && cmsPage.breadcrumbSchema && (
          <script
             type="application/ld+json"
             dangerouslySetInnerHTML={{ __html: JSON.stringify(cmsPage.breadcrumbSchema) }}
          />
        )}
        <SeoPageRenderer page={cmsPage} />
      </>
    );
  }

  return <>{children}</>;
}
