import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ExtraHand Blog | Smarter Local Services",
  description:
    "Read how ExtraHand connects customers with verified local experts, improves trust, and makes local services faster and safer.",
};

const highlights = [
  "Verified taskers with transparent profiles and reviews",
  "Fast discovery of service categories and subcategories",
  "Clear pricing, safer payments, and better outcomes",
  "Localized experience with city-level service discovery",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-8 md:mb-10">
          <p className="text-sm font-medium text-blue-700 mb-2">ExtraHand Blog</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Building A Trusted Local Services Marketplace With ExtraHand
          </h1>
          <p className="text-gray-600 mt-4">
            Updated on March 27, 2026
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-6 text-gray-700 leading-7">
          <p>
            ExtraHand is designed to solve a common problem: finding reliable local help quickly
            without sacrificing trust or quality. From home cleaning and plumbing to delivery and
            pet care, the platform helps people connect with verified experts in a few clicks.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">What makes this platform effective</h2>
          <ul className="list-disc pl-6 space-y-2">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900">Why this matters for users and taskers</h2>
          <p>
            For users, ExtraHand reduces search friction and improves confidence with better service
            discovery, meaningful category pages, and transparent selection signals. For taskers, it
            creates high-intent opportunities and recurring demand across city-based markets.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">What is next</h2>
          <p>
            The roadmap continues to focus on better category navigation, richer location discovery,
            and stronger SEO foundations so customers can find the right service page faster and book
            with confidence.
          </p>

          <div className="pt-2">
            <Link
              href="/services"
              className="text-blue-700 hover:text-blue-800 underline underline-offset-2 font-medium"
            >
              Explore all services
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
