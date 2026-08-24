'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllPublishedBlogs, BlogPost } from '@/lib/api/endpoints/blogs';
import { Calendar, User, MapPin, Tag, ArrowRight, BookOpen, Search } from 'lucide-react';

export default function BlogsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });

  const categoryParam = searchParams.get('category') || undefined;
  const cityParam = searchParams.get('city') || undefined;
  const rawPage = Number(searchParams.get('page') || '1');
  const page = Number.isFinite(rawPage) ? Math.max(1, Math.floor(rawPage)) : 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllPublishedBlogs({
      categorySlug: categoryParam,
      citySlug: cityParam,
      page,
      limit: 12,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setBlogs(res.data || []);
          setPagination(res.pagination || { page: 1, limit: 12, total: 0, pages: 1 });
        } else {
          setBlogs([]);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setBlogs([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryParam, cityParam, page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-gray-50/50 py-10 md:py-16">
      <main className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <header className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-white p-8 md:p-12 shadow-sm text-center md:text-left">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-yellow-100/60 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
              <BookOpen className="w-3.5 h-3.5" /> ExtraHand Blog & Guides
            </span>

            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Expert Advice, Cost Guides & Home Tips
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Explore trusted insights on packers & movers, electricians, cleaning, appliance repair, and verified local service professionals.
            </p>
          </div>
        </header>

        {/* Filter / Status line */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-medium text-gray-500">
            {loading ? (
              'Loading published articles...'
            ) : pagination.total > 0 ? (
              `Showing ${(pagination.page - 1) * pagination.limit + 1}–${Math.min(
                pagination.page * pagination.limit,
                pagination.total
              )} of ${pagination.total} articles`
            ) : (
              'Browse our latest publications'
            )}
          </div>
        </div>

        {/* Blog Cards Grid */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs animate-pulse">
                <div className="h-44 bg-gray-100 rounded-xl mb-4" />
                <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No blog posts available yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back soon for new guides, tips, and service recommendations.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog) => {
              const formattedDate = blog.publishedAt || blog.createdAt
                ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null;

              return (
                <article
                  key={blog._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs hover:border-amber-400 hover:shadow-lg transition-all duration-300"
                >
                  {/* Hero Image / Thumbnail */}
                  <Link href={`/blogs/${blog.slug}`} className="relative block h-52 w-full overflow-hidden bg-gray-100">
                    {blog.heroImage ? (
                      <img
                        src={blog.heroImage}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-amber-100/70 to-yellow-50 text-amber-800">
                        <BookOpen className="w-12 h-12 opacity-60" />
                      </div>
                    )}
                  </Link>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        <Tag className="w-3 h-3" /> {blog.category}
                      </span>
                      {blog.cityName && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                          <MapPin className="w-3 h-3 text-gray-400" /> {blog.cityName}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                      <Link href={`/blogs/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    {blog.metaDescription && (
                      <p className="mt-2.5 text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {blog.metaDescription}
                      </p>
                    )}

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {blog.writtenBy?.name && (
                          <span className="font-medium text-gray-700">{blog.writtenBy.name}</span>
                        )}
                        {formattedDate && (
                          <>
                            <span>·</span>
                            <span>{formattedDate}</span>
                          </>
                        )}
                      </div>

                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform"
                      >
                        Read <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {pagination.page > 1 && (
              <Link
                href={`/blogs?page=${pagination.page - 1}${categoryParam ? `&category=${categoryParam}` : ''}`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Previous
              </Link>
            )}

            <span className="text-xs text-gray-500 font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>

            {pagination.page < pagination.pages && (
              <Link
                href={`/blogs?page=${pagination.page + 1}${categoryParam ? `&category=${categoryParam}` : ''}`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
