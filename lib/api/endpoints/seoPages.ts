/**
 * SEO Pages API - Fetches published SEO pages from content-admin backend
 */

const CONTENT_ADMIN_URL =
  process.env.CONTENT_ADMIN_URL ||
  process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
  'https://extrahand-content-admin-backend.backend.extrahand.in';

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

// TEMPORARY DIAGNOSTIC LOGGING — remove after debugging
const SEO_ENV = typeof window === "undefined" ? "SERVER" : "BROWSER";
console.log("[SEO BUILD] Module loaded | CONTENT_ADMIN_URL =", CONTENT_ADMIN_URL, "| Env =", SEO_ENV);

export async function getPublishedSeoPage(slug: string): Promise<SeoPage | null> {
  const url = `${CONTENT_ADMIN_URL}/api/seo-pages/published?slug=${encodeURIComponent(slug)}`;
  try {
    const isBrowser = typeof window !== "undefined";
    const requestUrl = isBrowser ? `${url}&_t=${Date.now()}` : url;
    const res = await fetch(requestUrl, isBrowser ? { cache: 'no-cache' } : undefined);

    console.log(
      "[SEO RESPONSE] | slug =",
      slug,
      "| status =",
      res.status,
      "| statusText =",
      res.statusText,
      "| contentType =",
      res.headers.get("content-type"),
    );

    if (!res.ok) {
      const body = await res.text();
      console.log(
        "[SEO RESPONSE] | slug =",
        slug,
        "| url =",
        url,
        "| !res.ok — body =",
        body,
      );
      return null;
    }

    const text = await res.text();
    let data: SeoPage | null = null;
    try {
      data = JSON.parse(text);
      console.log(
        "[SEO RESPONSE] | slug =",
        slug,
        "| JSON parse ok | data is null?",
        data === null,
        "| data keys =",
        data ? Object.keys(data) : "N/A",
      );
    } catch (parseErr) {
      console.log(
        "[SEO ERROR] | slug =",
        slug,
        "| JSON parse FAILED | raw text preview =",
        text.slice(0, 500),
        "| error =",
        parseErr,
      );
      return null;
    }

    return data || null;
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.log(
      "[SEO ERROR] | slug =",
      slug,
      "| url =",
      url,
      "| name =",
      error.name,
      "| message =",
      error.message,
      "| stack =",
      error.stack,
    );
    return null;
  }
}
// END TEMPORARY DIAGNOSTIC LOGGING
