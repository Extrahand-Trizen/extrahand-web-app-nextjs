import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | ExtraHand",
  description:
    "Transparent pricing for ExtraHand services. Learn about our platform fees and how we calculate costs.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
          Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          No hidden fees. Know exactly what you're paying for.
        </p>

        {/* For Task Posters Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            For Task Posters
          </h2>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Platform Fee
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">Standard Tasks</p>
                  <p className="text-sm text-gray-600">Most services</p>
                </div>
                <p className="text-lg font-bold text-green-600">5%</p>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">High-Value Tasks</p>
                  <p className="text-sm text-gray-600">Tasks over ₹50,000</p>
                </div>
                <p className="text-lg font-bold text-green-600">3%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Our platform fee is deducted from your task budget to cover payment processing, security, and customer support.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Payment Processing Fees
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900 mb-2">Credit/Debit Card</p>
                <p className="text-gray-700">₹10 + 2.36% per transaction</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">UPI</p>
                <p className="text-gray-700">₹5 + 1.18% per transaction</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">Net Banking</p>
                <p className="text-gray-700">₹5 + 1.18% per transaction</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              These are processor fees charged by payment gateways for secure transactions.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Example Calculation
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Task Budget</span>
                <span className="font-medium">₹1,000</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (5%)</span>
                <span className="font-medium">- ₹50</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Processing Fee (UPI)</span>
                <span className="font-medium">- ₹12.18</span>
              </div>
              <div className="border-t border-blue-300 pt-3 flex justify-between font-bold">
                <span>Total Cost to You</span>
                <span>₹1,062.18</span>
              </div>
            </div>
          </div>
        </div>

        {/* For Taskers Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            For Taskers
          </h2>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Earnings & Commission
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900 mb-2">Commission Rate</p>
                <p className="text-lg text-gray-700">15% per task</p>
                <p className="text-sm text-gray-600 mt-2">
                  You keep 85% of the agreed task amount. Commission covers our platform, customer support, and payment processing.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="font-medium text-gray-900 mb-2">Payout Processing</p>
                <p className="text-gray-700">Free for all payment methods</p>
                <p className="text-sm text-gray-600 mt-2">
                  No deductions. Withdraw to your bank account or UPI instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Payout Methods
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Bank Transfer</p>
                  <p className="text-sm text-gray-600">Instant to your registered bank account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium text-gray-900">UPI</p>
                  <p className="text-sm text-gray-600">Instant to your UPI ID</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Wallet</p>
                  <p className="text-sm text-gray-600">Hold funds for later or withdraw anytime</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Earnings Example
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Agreed Task Amount</span>
                <span className="font-medium">₹1,000</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Commission (15%)</span>
                <span className="font-medium">- ₹150</span>
              </div>
              <div className="border-t border-green-300 pt-3 flex justify-between font-bold">
                <span>You Earn</span>
                <span className="text-green-600">₹850</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                When do I pay the platform fee?
              </h3>
              <p className="text-gray-700">
                For task posters, the platform fee is collected when you post a task and a tasker accepts it. The fee is calculated on the agreed task amount.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Can I negotiate the price with a tasker?
              </h3>
              <p className="text-gray-700">
                Yes! You can set your budget as "Negotiable" when posting a task, allowing taskers to suggest their own rates. The final agreed amount will have our fees applied.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                What if the task is not completed?
              </h3>
              <p className="text-gray-700">
                Your payment is held in escrow until the task is completed. If there's a dispute, our support team will review and either refund you or release the funds to the tasker.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Are there additional charges I should know about?
              </h3>
              <p className="text-gray-700">
                Only the platform fee and payment processing fees. We're transparent about all costs. No hidden charges or surprise fees.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Do taskers pay any fees?
              </h3>
              <p className="text-gray-700">
                Taskers pay a 15% platform commission on completed tasks. Payout to your bank account or UPI is completely free with no additional processing fees.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                How quickly can I withdraw my earnings?
              </h3>
              <p className="text-gray-700">
                Payouts are instant! Once a task is completed and rated, you can withdraw immediately to your bank account or UPI. Most transfers complete within 2-5 minutes.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Can I get a refund if I'm not satisfied?
              </h3>
              <p className="text-gray-700">
                If you're not satisfied with the work, contact our support team within 24 hours. We'll work with you and the tasker to resolve the issue. Refunds are processed according to our Refund Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 md:p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="mb-4">Our support team is here to help</p>
          <a
            href="https://extrhand-support-frontend.apps.extrahand.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
