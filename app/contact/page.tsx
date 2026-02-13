import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ExtraHand",
  description:
    "Contact details for support, complaints, and queries related to the ExtraHand marketplace.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Contact Us
        </h1>

        <div className="prose prose-gray max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="mb-4 text-gray-700">
            For any support, complaints, refund queries, or general questions
            related to the ExtraHand platform, you can reach us using the details
            below.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
            Company Details
          </h2>
          <p className="mb-4 text-gray-700">
            <strong>Naipunya AI Labs Private Limited</strong>
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
            Email Support
          </h2>
          <p className="mb-4 text-gray-700">
            For any issues or queries, please write to:
          </p>
          <p className="mb-4 text-gray-700">
            <a
              href="mailto:support@extrahand.in"
              className="text-blue-600 hover:underline"
            >
              support@extrahand.in
            </a>
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
            Response Timelines
          </h2>
          <p className="mb-4 text-gray-700">
            We aim to acknowledge all queries within{" "}
            <strong>2 business days</strong> and provide a resolution or update
            within <strong>7–10 business days</strong>, depending on the nature
            of the issue.
          </p>

          <p className="text-xs text-gray-500 mt-8">
            This page may be updated from time to time. The latest contact
            details will always be available here.
          </p>
        </div>
      </div>
    </div>
  );
}

