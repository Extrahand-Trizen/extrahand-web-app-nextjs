import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedBlog, getAllPublishedBlogs } from '@/lib/api/endpoints/blogs';
import { Tag, MapPin, Calendar, User } from 'lucide-react';

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const res = await getAllPublishedBlogs({ limit: 100 });
    const blogs = res?.data || [];
    if (blogs.length > 0) {
      return blogs.map((b) => ({ slug: b.slug }));
    }
  } catch (e) {
    // ignore
  }
  return [{ slug: '_' }];
}

export async function generateMetadata({ params }: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlog(slug);

  if (!blog || blog.status !== 'PUBLISHED') {
    return {
      title: 'Blog Not Found | ExtraHand',
      description: 'The requested blog post could not be found.',
    };
  }

  const canonicalUrl = blog.canonicalUrl || `https://extrahand.in/blogs/${blog.slug}`;

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || '',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || '',
      url: canonicalUrl,
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      images: blog.heroImage ? [{ url: blog.heroImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || '',
      images: blog.heroImage ? [blog.heroImage] : undefined,
    },
  };
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const blog = await getPublishedBlog(slug);

  if (!blog || blog.status !== 'PUBLISHED') {
    notFound();
  }

  const authorName = blog.writtenBy?.name || 'ExtraHand Editorial';
  const publishedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Approximate reading time
  const wordCount = (blog.bodyHtml || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const heroImageUrl = blog.heroImage
    ? (() => {
        if (blog.heroImage.startsWith('data:')) {
          return blog.heroImage;
        }

        try {
          const imageUrl = new URL(blog.heroImage);
          if (imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:') {
            imageUrl.searchParams.set('v', blog.updatedAt);
          }
          return imageUrl.toString();
        } catch {
          return blog.heroImage;
        }
      })()
    : null;

  // Build JSON-LD FAQ Schema
  const faqSchema =
    blog.faqSchema ||
    (blog.faqs && blog.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: blog.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null);

  // Build Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.metaDescription,
    image: blog.heroImage ? [blog.heroImage] : undefined,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ExtraHand',
      logo: {
        '@type': 'ImageObject',
        url: 'https://extrahand.in/assets/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blog.canonicalUrl || `https://extrahand.in/blogs/${blog.slug}`,
    },
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-gray-50/40 py-8 md:py-14">
        <main className="container mx-auto max-w-5xl px-4">
          {/* Article Container */}
          <article className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 md:p-12 shadow-sm space-y-8">
            {/* Header */}
            <header className="space-y-4 border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800 uppercase tracking-wide">
                  <Tag className="w-3 h-3" /> {blog.category}
                </span>
                {blog.cityName && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                    <MapPin className="w-3 h-3 text-gray-400" /> {blog.cityName}
                    {blog.areaName ? ` / ${blog.areaName}` : ''}
                  </span>
                )}
              </div>

              {/* On-Page H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {blog.title}
              </h1>

              {/* Author & Date Bar */}
              <div className="flex items-center gap-3 pt-2 text-xs text-gray-500">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-gray-900 font-extrabold text-sm shadow-xs">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{authorName}</p>
                  <p className="text-[11px] text-gray-400">
                    {publishedDate} · {readingTimeMinutes} min read
                  </p>
                </div>
              </div>
            </header>

            {/* Hero Image */}
            {heroImageUrl && (
              <div className="w-full overflow-hidden rounded-2xl bg-gray-100 my-6 shadow-xs">
                <img
                  src={heroImageUrl}
                  alt={blog.title}
                  className="w-full max-h-[460px] object-cover"
                />
              </div>
            )}

            {/* Article Body Content */}
            <div
              className="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed [&_h1]:font-sans [&_h1]:text-3xl sm:[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:text-gray-900 [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:font-sans [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-sans [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-6 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4 [&_li]:my-1.5 [&_a]:text-amber-600 [&_a]:underline hover:[&_a]:text-amber-800 [&_p]:my-4 [&_img]:rounded-2xl [&_img]:max-w-full [&_img]:my-8 [&_img]:shadow-md text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: blog.bodyHtml || '' }}
            />
          </article>
        </main>
      </div>
    </>
  );
}
