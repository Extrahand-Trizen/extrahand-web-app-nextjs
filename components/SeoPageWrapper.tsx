"use client";

import React, { useEffect, useState } from "react";
import { getPublishedSeoPage, type SeoPage } from "@/lib/api/endpoints/seoPages";
import SeoPageRenderer from "@/components/SeoPageRenderer";

interface SeoPageWrapperProps {
  slug: string;
  initialPage?: SeoPage | null;
  children: React.ReactNode;
}

export default function SeoPageWrapper({
  slug,
  initialPage = null,
  children,
}: SeoPageWrapperProps) {
  const [cmsPage, setCmsPage] = useState<SeoPage | null>(initialPage);

  useEffect(() => {
    if (initialPage) {
      setCmsPage(initialPage);
      return;
    }

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
        {cmsPage.faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(cmsPage.faqSchema) }}
          />
        )}
        {cmsPage.breadcrumbSchema && (
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
