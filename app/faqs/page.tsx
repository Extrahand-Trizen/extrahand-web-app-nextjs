import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | ExtraHand",
  description: "Frequently asked questions about ExtraHand services.",
};

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Frequently Asked Questions
        </h1>

        <p className="text-gray-700 mb-6">
          Find answers to the most common questions about using ExtraHand.
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              What is ExtraHand?
            </h2>
            <p className="text-gray-700">
              ExtraHand is a trusted marketplace that connects customers
              (Posters) with verified service professionals (Taskers) to help
              with everyday tasks and services.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              How does ExtraHand work?
            </h2>
            <p className="text-gray-700">
              Simply post a task, browse verified taskers, and hire the one who
              best fits your needs. Pay securely through our platform and rate
              the work when complete.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              How do I post a task?
            </h2>
            <p className="text-gray-700">
              Click on &quot;Post a Task&quot; in the top navigation, fill in the
              details about your task, set a budget, and submit. You&apos;ll then
              receive applications from interested taskers.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              How much does it cost?
            </h2>
            <p className="text-gray-700">
              Pricing is set by individual taskers based on their experience and
              the complexity of the task. You decide the budget when posting your
              task.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Is my payment secure?
            </h2>
            <p className="text-gray-700">
              Yes! All payments are processed securely through our platform.
              Payment is only released to the tasker after you confirm the work
              is complete.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              What if I&apos;m not satisfied with the work?
            </h2>
            <p className="text-gray-700">
              We have a resolution process to handle disputes. Please contact our
              support team and we&apos;ll work to find a fair solution for both
              parties.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              How do I become a tasker?
            </h2>
            <p className="text-gray-700">
              Click on &quot;Become a Tasker&quot; and complete our verification
              process. You&apos;ll need to provide identification and pass our
              background check.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              How do taskers get paid?
            </h2>
            <p className="text-gray-700">
              Taskers earn money by completing tasks. Payments are transferred to
              their account within 24-48 hours after the customer confirms task
              completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
