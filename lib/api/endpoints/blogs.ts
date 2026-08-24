import { cache } from 'react';

/**
 * Blogs API - Fetches published blog posts from content-admin backend
 */

const PRODUCTION_BACKEND_URL = 'https://extrahand-content-admin-backend.backend.extrahand.in';

const CONTENT_ADMIN_URL =
  typeof window === 'undefined'
    ? (process.env.CONTENT_ADMIN_URL || process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL || PRODUCTION_BACKEND_URL)
    : PRODUCTION_BACKEND_URL;

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  _id: string;
  pageType: 'blog';
  title: string; // On-page H1
  metaTitle: string;
  metaDescription: string;
  slug: string;
  canonicalUrl?: string;
  category: string;
  categorySlug: string;
  cityId?: string | null;
  cityName?: string | null;
  citySlug?: string | null;
  areaId?: string | null;
  areaName?: string | null;
  areaSlug?: string | null;
  heroImage?: string | null;
  bodyHtml: string;
  faqs?: BlogFaq[];
  faqSchema?: Record<string, unknown> | null;
  status: string;
  isPublished: boolean;
  writtenBy?: {
    _id?: string;
    name?: string;
    email?: string;
  } | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsListResponse {
  data: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Fetch a single published blog by slug
 */
export const getPublishedBlog = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!slug) return null;
  const url = `${CONTENT_ADMIN_URL}/api/blogs/published?slug=${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60, tags: ['blogs', `blog-${slug}`] } });

    if (!res.ok) {
      return null;
    }

    const data: BlogPost = await res.json();
    return data || null;
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[BLOG ERROR] getPublishedBlog failed for slug:', slug, err);
    }
    return null;
  }
});

/**
 * Fetch published blogs list with optional category, city and pagination filters
 */
export async function getAllPublishedBlogs(params: {
  categorySlug?: string;
  citySlug?: string;
  page?: number;
  limit?: number;
} = {}): Promise<BlogsListResponse | null> {
  const query = new URLSearchParams();
  if (params.categorySlug && params.categorySlug !== 'all') query.set('categorySlug', params.categorySlug);
  if (params.citySlug && params.citySlug !== 'all') query.set('citySlug', params.citySlug);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const url = `${CONTENT_ADMIN_URL}/api/blogs/published?${query.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60, tags: ['blogs'] } });
    if (!res.ok) return null;
    const data: BlogsListResponse = await res.json();
    return data || null;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[BLOG ERROR] getAllPublishedBlogs failed:', err);
    }
    return null;
  }
}
