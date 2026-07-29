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
    // If already have a page from SSG, keep it
    if (initialPage) {
      setCmsPage(initialPage);
      return;
    }

    // Client-side fallback: fetch CMS page when SSG didn't get it
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
    return <SeoPageRenderer page={cmsPage} />;
  }

  return <>{children}</>;
}

