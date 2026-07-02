/**
 * SEO Pages API - Fetches published SEO pages from content-admin backend
 */

const CONTENT_ADMIN_URL =
  process.env.CONTENT_ADMIN_URL ||
  process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
  'https://extrahand-content-admin-backend.apps.extrahand.in';

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
  serviceSolutions?: Array<{ title: string; description: string }>;
  whyExtrahandHeading?: string | null;
  whyExtrahandDescription?: string | null;
  whyExtrahand?: string[];
  whyExtrahandDescription2?: string | null;
  howItWorks?: Array<{ step: number; title: string; description: string }>;
  benefits?: string[];
  commonProblems?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  faqSchema?: Record<string, unknown>;
  breadcrumbSchema?: Record<string, unknown>;
  status: string;
  isPublished: boolean;
}

export async function getPublishedSeoPage(slug: string): Promise<SeoPage | null> {
  try {
    const res = await fetch(
      `${CONTENT_ADMIN_URL}/api/seo-pages/published?slug=${encodeURIComponent(slug)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data || null;
  } catch {
    return null;
  }
}
