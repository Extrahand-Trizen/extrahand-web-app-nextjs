import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blogPosts";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | ExtraHand Blog",
      description: "The requested article does not exist.",
    };
  }

  return {
    title: `${post.title} | ExtraHand Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-amber-50">
      <article className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Link href="/blog" className="inline-flex text-sm font-semibold text-slate-700 hover:underline">
          Back to all posts
        </Link>

        <header className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {post.category}
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">{post.title}</h1>

          <p className="mt-4 text-base leading-7 text-slate-600">{post.excerpt}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-500">
            By {post.author} | Published {post.publishedAt} | Updated {post.updatedAt} | {post.readTime}
          </p>
        </header>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
