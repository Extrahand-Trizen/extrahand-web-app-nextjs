import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report an Issue | ExtraHand",
  description:
    "Report a problem or concern on the ExtraHand platform.",
};

export default function ReportAnIssuePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Report an Issue
        </h1>

        <p className="text-gray-700 mb-6">
          We&apos;re committed to maintaining a safe and reliable platform. If
          you&apos;ve experienced a problem or have concerns, we&apos;d like to
          hear about it.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Types of Issues We Can Help With
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Task-related disputes or quality concerns</li>
            <li>Payment issues or billing problems</li>
            <li>Safety or security concerns</li>
            <li>Inappropriate behavior from other members</li>
            <li>Technical problems with the platform</li>
            <li>Account or verification issues</li>
            <li>Any other platform-related concerns</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            How to Report an Issue
          </h2>
          <p className="text-gray-700 mb-4">
            To report an issue, please email our support team with:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
            <li>A clear description of the issue</li>
            <li>When the issue occurred</li>
            <li>Any relevant task IDs or usernames involved</li>
            <li>Screenshots or documentation if applicable</li>
            <li>Steps you&apos;ve already taken to resolve it</li>
          </ul>
          <p className="text-gray-700">
            Send your report to:{' '}
            <a
              href="mailto:support@extrahand.in"
              className="text-blue-600 hover:underline"
            >
              support@extrahand.in
            </a>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            What to Expect
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Acknowledgment of your report within 24 hours</li>
            <li>Investigation into your concern</li>
            <li>Regular updates on the status of your case</li>
            <li>A resolution or explanation of findings</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            For Urgent Safety Concerns
          </h2>
          <p className="text-gray-700 mb-4">
            If you&apos;re concerned about your immediate safety, please contact
            local law enforcement first, then report to us as soon as possible.
          </p>
          <p className="text-gray-700">
            You can also reach our urgent support team at:{' '}
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
