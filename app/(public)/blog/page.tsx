import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_CATEGORIES, BLOG_POSTS, BLOG_TAGS } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "ExtraHand Blog | Articles, Categories, and Insights",
  description:
    "Browse ExtraHand blog posts by category and tags with paginated article listings.",
};

const POSTS_PER_PAGE = 6;

type BlogPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    category?: string | string[];
    tag?: string | string[];
  }>;
};

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buildBlogUrl(page: number, category?: string, tag?: string) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (category) {
    params.set("category", category);
  }

  if (tag) {
    params.set("tag", tag);
  }

  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = getSingleParam(resolvedSearchParams?.category);
  const selectedTag = getSingleParam(resolvedSearchParams?.tag);
  const rawPage = Number(getSingleParam(resolvedSearchParams?.page) || "1");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesCategory && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Number.isFinite(rawPage)
    ? Math.min(Math.max(1, Math.floor(rawPage)), totalPages)
    : 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-amber-50">
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="pointer-events-none absolute -right-14 -top-10 h-36 w-36 rounded-full bg-amber-200/60 blur-2xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-200/60 blur-2xl" />

          <p className="relative inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            ExtraHand Blog
          </p>

          <h1 className="relative mt-4 max-w-4xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Articles On Local Services, Trust, and Marketplace Growth
          </h1>

          <p className="relative mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            Browse posts by category and tags, then open full articles for deeper insights.
          </p>
        </header>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">Categories</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={buildBlogUrl(1, undefined, selectedTag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                !selectedCategory
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              All categories
            </Link>
            {BLOG_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={buildBlogUrl(1, category, selectedTag)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selectedCategory === category
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          <h2 className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">Tags</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={buildBlogUrl(1, selectedCategory, undefined)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                !selectedTag
                  ? "border-amber-700 bg-amber-700 text-white"
                  : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300"
              }`}
            >
              All tags
            </Link>
            {BLOG_TAGS.map((tag) => (
              <Link
                key={tag}
                href={buildBlogUrl(1, selectedCategory, tag)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selectedTag === tag
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300"
                }`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">{post.category}</p>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-slate-900">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={buildBlogUrl(1, selectedCategory, tag)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {post.publishedAt} | {post.readTime}
              </p>
            </article>
          ))}
        </section>

        {visiblePosts.length === 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
            No posts found for the selected filters. Try a different category or tag.
          </section>
        )}

        <section className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Showing {visiblePosts.length} of {filteredPosts.length} posts | Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={buildBlogUrl(currentPage - 1, selectedCategory, selectedTag)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                currentPage === 1
                  ? "pointer-events-none border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
            >
              Previous
            </Link>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <Link
                  key={pageNumber}
                  href={buildBlogUrl(pageNumber, selectedCategory, selectedTag)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                    pageNumber === currentPage
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
            <Link
              href={buildBlogUrl(currentPage + 1, selectedCategory, selectedTag)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                currentPage === totalPages
                  ? "pointer-events-none border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
            >
              Next
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
