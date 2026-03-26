import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines | ExtraHand",
  description:
    "Guidelines for safe and respectful behavior on the ExtraHand platform.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Community Guidelines
        </h1>

        <p className="text-gray-700 mb-6">
          ExtraHand is built on trust, respect, and safety. These guidelines help
          us maintain a positive community for everyone.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Be Respectful
          </h2>
          <p className="text-gray-700">
            Treat all community members with respect and courtesy. Harassment,
            discrimination, or bullying of any kind is not tolerated. This
            includes behavior based on race, ethnicity, gender, age, religion,
            sexual orientation, or any other characteristic.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Be Honest and Transparent
          </h2>
          <p className="text-gray-700">
            Provide accurate information in your profile and task descriptions.
            Don&apos;t misrepresent your skills, experience, or availability.
            Transparency builds trust.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Keep the Platform Safe
          </h2>
          <p className="text-gray-700">
            Don&apos;t engage in illegal activities or help others do so. Don&apos;t
            share inappropriate content, spam, or try to manipulate the platform.
            Report any suspicious activity to our support team.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Respect Privacy
          </h2>
          <p className="text-gray-700">
            Don&apos;t share personal information about other members without
            consent. Respect everyone&apos;s privacy and data. Only use contact
            information to discuss tasks on ExtraHand.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Communicate Professionally
          </h2>
          <p className="text-gray-700">
            Keep all communications professional and relevant to the task at hand.
            Don&apos;t use the platform to sell unrelated products or services or
            to solicit personal relationships.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Violations
          </h2>
          <p className="text-gray-700 mb-4">
            Violations of these guidelines may result in warnings, account
            suspension, or permanent removal from the platform. For serious
            violations, we may involve law enforcement.
          </p>
          <p className="text-gray-700">
            If you see a violation, please report it to:{' '}
            <a
              href="mailto:support@extrahand.in"
              className="text-blue-600 hover:underline"
            >
              support@extrahand.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
