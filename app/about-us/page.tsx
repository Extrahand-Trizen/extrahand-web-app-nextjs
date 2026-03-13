import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | ExtraHand",
  description:
    "Learn about ExtraHand - a trusted marketplace connecting Posters with verified Taskers.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          About ExtraHand
        </h1>

        <p className="text-gray-700 mb-6">
          ExtraHand is a trusted marketplace that connects Posters with verified
          Taskers to get everyday jobs done safely and reliably. We believe that
          quality service should be accessible, affordable, and secure for
          everyone.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Our Mission
          </h2>
          <p className="text-gray-700">
            To revolutionize the way people access local services by creating a
            trusted platform where skilled taskers can connect with customers who
            need their expertise. We empower both service providers and customers
            by ensuring safety, transparency, and reliability in every
            transaction.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Our Vision
          </h2>
          <p className="text-gray-700">
            To become the most trusted platform for local services, where every
            interaction is secure, transparent, and valuable for both taskers and
            customers. We aim to create economic opportunities for skilled
            professionals while providing reliable solutions for everyday needs.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Why Choose ExtraHand?
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <strong>Verified Professionals:</strong> All taskers are screened
              and verified for quality and reliability
            </li>
            <li>
              <strong>Safe & Secure:</strong> Secure payment system and safety
              measures to protect both parties
            </li>
            <li>
              <strong>Transparent Pricing:</strong> Clear pricing with no hidden
              charges
            </li>
            <li>
              <strong>24/7 Support:</strong> Dedicated support team available to
              help when you need it
            </li>
            <li>
              <strong>Quality Guaranteed:</strong> We stand behind the quality of
              work done on our platform
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
