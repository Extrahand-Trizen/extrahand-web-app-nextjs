import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogsClient from './BlogsClient';

export const metadata: Metadata = {
  title: 'ExtraHand Blog | Guides, Tips, and Local Services Insights',
  description:
    'Read the latest guides, cost breakdowns, and expert tips on home repair, cleaning, shifting, and on-demand local services.',
  alternates: {
    canonical: 'https://extrahand.in/blogs',
  },
  openGraph: {
    title: 'ExtraHand Blog | Guides, Tips, and Local Services Insights',
    description:
      'Read the latest guides, cost breakdowns, and expert tips on home repair, cleaning, shifting, and on-demand local services.',
    url: 'https://extrahand.in/blogs',
    type: 'website',
  },
};

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white py-16 text-center text-sm text-gray-500">
          Loading ExtraHand blogs...
        </div>
      }
    >
      <BlogsClient />
    </Suspense>
  );
}
