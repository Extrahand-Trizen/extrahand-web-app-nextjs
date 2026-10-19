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
  serviceSolutionsDescription?: string | null;
  serviceSolutionsPoints?: string[];
  serviceSolutions?: Array<{ title: string; description: string }>;
  whyExtrahandHeading?: string | null;
  whyExtrahandDescription?: string | null;
  whyExtrahand?: string[];
  whyExtrahandBenefitsIncludedHeading?: string | null;
  whyExtrahandBenefitsIncluded?: string[];
  whyExtrahandBenefitsIncludedDescription?: string | null;
  whyExtrahandDescription2?: string | null;
  howItWorks?: Array<{ step: number; title: string; description: string }>;
  howItWorksDescription?: string | null;
  howItWorksPoints?: string[];
  benefitsHeading?: string | null;
  benefitsDescription?: string | null;
  benefitsOnlyPoints?: boolean;
  benefits?: string[];
  benefitsIncludedHeading?: string | null;
  benefitsIncluded?: string[];
  benefitsIncludedDescription?: string | null;
  commonProblemsHeading?: string | null;
  commonProblemsDescription?: string | null;
  commonProblems?: string[];
  faqsDescription?: string | null;
  faqsPoints?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  sectionOrder?: string[];
  seoContentBlocks?: Array<{
    id: string;
    type?: 'content' | 'faq';
    title?: string | null;
    html?: string | null;
    faqs?: Array<{ id?: string; question: string; answer: string }>;
  }>;
  faqSchema?: Record<string, unknown>;
  breadcrumbSchema?: Record<string, unknown>;
  status: string;
  isPublished: boolean;
}

export async function getPublishedSeoPage(slug: string): Promise<SeoPage | null> {
  const normalized = (slug || '').trim().toLowerCase();
  if (!normalized) return null;

  const url = `${CONTENT_ADMIN_URL}/api/seo-pages/published?slug=${encodeURIComponent(normalized)}`;
  try {
    const res = await fetch(url, {
      // Always fetch fresh — published content must appear immediately after publish.
      // The SeoPageWrapper client component also re-fetches on mount for instant hydration.
      cache: 'no-store',
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
}

export interface PublishedSeoSlug {
  slug: string;
  canonicalUrl?: string;
  pageType?: 'city' | 'area';
  categorySlug?: string;
  citySlug?: string;
  areaSlug?: string | null;
  isPublished?: boolean;
  updatedAt?: string;
}

/**
 * Lightweight endpoint for build-time generateStaticParams().
 * Fetches only slug, isPublished, and updatedAt fields.
 */
export async function getAllPublishedSeoPages(): Promise<Array<PublishedSeoSlug> | null> {
  const slugsUrl = `${CONTENT_ADMIN_URL}/api/seo-pages/published/slugs`;
  const fallbackUrl = `${CONTENT_ADMIN_URL}/api/seo-pages/published`;

  try {
    const res = await fetch(slugsUrl, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch {
    // Try fallback endpoint
  }

  try {
    const res = await fetch(fallbackUrl, {
      next: { revalidate: 300 },
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
