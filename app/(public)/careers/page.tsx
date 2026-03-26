import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | ExtraHand",
  description:
    "Join the ExtraHand team and help build a trusted marketplace for local services.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Careers at ExtraHand
        </h1>

        <p className="text-gray-700 mb-6">
          We&apos;re building a trusted marketplace that connects Posters with
          verified Taskers to get everyday jobs done safely and reliably. If you
          are passionate about marketplaces, operations, and customer experience,
          we&apos;d love to hear from you.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            How to Apply
          </h2>
          <p className="text-gray-700 mb-4">
            We are currently accepting applications via email. Please share your
            resume, a short note about yourself, and relevant links (LinkedIn,
            portfolio, GitHub, etc.) with our hiring team.
          </p>
          <p className="text-gray-700">
            Email:{' '}
            <a
              href="mailto:careers@extrahand.in"
              className="text-blue-600 hover:underline"
            >
              careers@extrahand.in
            </a>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            What We Look For
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Bias for action and ownership</li>
            <li>Strong problem-solving and communication skills</li>
            <li>Customer-first mindset and integrity</li>
            <li>Comfort working in fast-moving, early-stage environments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

