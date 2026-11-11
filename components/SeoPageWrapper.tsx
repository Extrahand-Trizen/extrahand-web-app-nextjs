"use client";

import React from "react";
import type { SeoPage } from "@/lib/api/endpoints/seoPages";
import SeoPageRenderer from "@/components/SeoPageRenderer";

interface SeoPageWrapperProps {
  slug: string;
  initialPage?: SeoPage | null;
  children: React.ReactNode;
}

/**
 * Renders the CMS page fetched by the server, or the default page when no
 * published CMS page exists.
 *
 * NOTE: JSON-LD schema <script> tags are intentionally NOT rendered here.
 * They must be rendered in the parent server component so they appear in the
 * initial static HTML (required for SEO / Google Rich Results).
 */
export default function SeoPageWrapper({
  initialPage = null,
  children,
}: SeoPageWrapperProps) {
  if (initialPage) {
    return (
      <SeoPageRenderer page={initialPage} />
    );
  }

  return <>{children}</>;
}
