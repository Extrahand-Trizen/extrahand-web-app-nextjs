import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust & Safety | ExtraHand",
  description:
    "Learn about ExtraHand's trust and safety measures.",
};

export default function TrustSafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Trust & Safety
        </h1>

        <p className="text-gray-700 mb-6">
          Your safety and security are our top priorities. We&apos;ve implemented
          comprehensive measures to protect both customers and taskers on the
          ExtraHand platform.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Tasker Verification
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Comprehensive background checks for all taskers</li>
            <li>Identity verification and document authentication</li>
            <li>Skills and experience validation</li>
            <li>Ongoing monitoring and rating reviews</li>
            <li>Removal of taskers who don&apos;t meet our standards</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Secure Payments
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Encrypted payment processing</li>
            <li>Escrow system protecting both parties</li>
            <li>Payment held until task completion</li>
            <li>Secure refund policies</li>
            <li>No sharing of financial information between users</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Rating & Review System
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Verified reviews from actual transactions</li>
            <li>Transparent rating history for all members</li>
            <li>Detection and removal of fake reviews</li>
            <li>Protection against review manipulation</li>
            <li>Accountability through public profiles</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Privacy Protection
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Encryption of personal information</li>
            <li>Limited data sharing between users</li>
            <li>Secure data storage with regular backups</li>
            <li>Clear privacy policy and data handling practices</li>
            <li>GDPR and data protection compliance</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Dispute Resolution
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Dedicated support team for conflict resolution</li>
            <li>Fair and transparent dispute process</li>
            <li>Investigation into all reported issues</li>
            <li>Mediation services for both parties</li>
            <li>Action against violation of community guidelines</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Your Responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Keep your account password secure</li>
            <li>Meet taskers in safe, public locations</li>
            <li>Verify tasker credentials before hiring</li>
            <li>Communicate clearly about task expectations</li>
            <li>Report suspicious activity immediately</li>
            <li>Follow all community guidelines</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Report Safety Concerns
          </h2>
          <p className="text-gray-700 mb-4">
            If you experience any safety concerns or have information about
            suspicious activity, please report it immediately to our safety team.
          </p>
          <p className="text-gray-700">
            Contact our safety team at:{' '}
            <a
              href="mailto:safety@extrahand.in"
              className="text-blue-600 hover:underline"
            >
              safety@extrahand.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
