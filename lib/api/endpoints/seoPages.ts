import { cache } from 'react';

/**
 * SEO Pages API - Fetches published SEO pages from content-admin backend
 */

// Server-side: use CONTENT_ADMIN_URL (private, only on server, never localhost in prod)
// Browser-side: always use the public production backend URL directly.
const PRODUCTION_BACKEND_URL = 'https://extrahand-content-admin-backend.backend.extrahand.in';

const CONTENT_ADMIN_URL =
  typeof window === 'undefined'
    // Server / build time: use private server env var, then production fallback
    ? (process.env.CONTENT_ADMIN_URL || PRODUCTION_BACKEND_URL)
    // Browser: always use production backend — never localhost
    : PRODUCTION_BACKEND_URL;

export interface SeoPage {
  _id: string;
  pageType: 'city' | 'area';
  categoryName: string;
  categorySlug: string;
  cityId: string;
  cityName: string;
  citySlug: string;
  areaId?: string | null;
  areaName?: string | null;
  areaSlug?: string | null;
  slug: string;
  canonicalUrl?: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroHeading2?: string | null;
  heroDescription: string;
  heroImage?: string | null;
  whyChooseHeading?: string | null;
  whyChooseDescription?: string | null;
  whyChoose?: Array<{ label: string; description: string }>;
  serviceSolutionsHeading?: string | null;
  serviceSolutionsHeading2?: string | null;
  serviceSolutions?: Array<{ title: string; description: string }>;
  whyExtrahandHeading?: string | null;
  whyExtrahandDescription?: string | null;
  whyExtrahand?: string[];
  whyExtrahandBenefitsIncludedHeading?: string | null;
  whyExtrahandBenefitsIncluded?: string[];
  whyExtrahandBenefitsIncludedDescription?: string | null;
  whyExtrahandDescription2?: string | null;
  howItWorks?: Array<{ step: number; title: string; description: string }>;
  benefitsHeading?: string | null;
  benefitsDescription?: string | null;
  benefitsOnlyPoints?: boolean;
  benefits?: string[];
  benefitsIncludedHeading?: string | null;
  benefitsIncluded?: string[];
  benefitsIncludedDescription?: string | null;
  commonProblems?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  faqSchema?: Record<string, unknown>;
  breadcrumbSchema?: Record<string, unknown>;
  status: string;
  isPublished: boolean;
}

export const getPublishedSeoPage = cache(async (slug: string): Promise<SeoPage | null> => {
  const url = `${CONTENT_ADMIN_URL}/api/seo-pages/published?slug=${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    const data: SeoPage = await res.json();
    return data || null;
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SEO ERROR] getPublishedSeoPage failed for slug:', slug, err);
    }
    return null;
  }
});

export async function getAllPublishedSeoPages(): Promise<Array<{ slug: string }> | null> {
  const url = `${CONTENT_ADMIN_URL}/api/seo-pages/published`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SEO ERROR] getAllPublishedSeoPages failed:', err);
    }
    return null;
  }
}
