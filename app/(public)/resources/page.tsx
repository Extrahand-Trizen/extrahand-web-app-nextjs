import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources | ExtraHand",
  description:
    "Helpful resources for posters and taskers on ExtraHand.",
};

const resourceLinks = [
  { label: "Help Center", href: "https://support.extrahand.in/" },
  { label: "FAQs", href: "/faqs" },
  { label: "Trust & Safety", href: "/trust-safety" },
  { label: "Community Guidelines", href: "/community-guidelines" },
  { label: "Pricing", href: "/pricing" },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Resources
        </h1>

        <p className="text-gray-700 mb-8">
          Quick links to key guides and support pages for using ExtraHand effectively.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <ul className="space-y-3">
            {resourceLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-blue-700 hover:text-blue-800 underline underline-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
