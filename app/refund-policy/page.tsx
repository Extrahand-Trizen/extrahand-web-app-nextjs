import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | ExtraHand",
  description:
    "Refund and cancellation policy for the ExtraHand marketplace operated by Naipunya AI Labs Private Limited.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Refund &amp; Cancellation Policy
        </h1>

        <div className="prose prose-gray max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="text-lg font-semibold mb-4 text-gray-900">
            This Refund &amp; Cancellation Policy explains how refunds are
            handled for transactions made on the ExtraHand platform operated by{" "}
            <strong>Naipunya AI Labs Private Limited</strong> (&quot;we&quot;,
            &quot;us&quot;, &quot;our&quot;).
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            1. Platform Nature
          </h2>
          <p className="mb-4 text-gray-700">
            ExtraHand is a marketplace platform that connects customers
            (&quot;Posters&quot;) with independent service providers
            (&quot;Taskers&quot;). Payments are processed through RBI-compliant
            payment partners and may be held in escrow until completion of the
            service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            2. When Refunds Are Applicable
          </h2>
          <p className="mb-4 text-gray-700">
            Subject to the conditions below, a Poster may be eligible for a full
            or partial refund in the following situations:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>The Tasker does not start the task within the agreed time.</li>
            <li>
              The Tasker cancels the task before or during execution and the
              Poster does not wish to continue.
            </li>
            <li>
              The service delivered is materially different from what was booked,
              and both parties agree to cancel.
            </li>
            <li>
              A duplicate charge or clearly demonstrable payment error has
              occurred.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            3. Non-Refundable Situations
          </h2>
          <p className="mb-4 text-gray-700">
            Refunds will generally not be provided in the following scenarios:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>
              Change of mind by the Poster after the Tasker has already started
              or completed the task, unless otherwise agreed between Poster and
              Tasker.
            </li>
            <li>
              Dissatisfaction with the outcome where the Tasker has reasonably
              complied with the agreed scope.
            </li>
            <li>
              Requests made beyond the defined refund request period (see below).
            </li>
            <li>
              Situations where law enforcement or regulatory authorities direct
              that funds be held or adjusted.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            4. Refund Request Window
          </h2>
            <p className="mb-6 text-gray-700">
            Unless otherwise notified on the booking screen, Posters must raise a
            refund request within{" "}
            <strong>72 hours of the scheduled task completion time</strong> or
            actual completion (whichever is earlier). Requests raised after this
            period may not be eligible for a refund.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            5. How Refunds Are Processed
          </h2>
          <p className="mb-4 text-gray-700">
            Where a refund is approved, we will generally:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>
              Reverse any pending transfers to the Tasker (where funds are held
              in escrow), and
            </li>
            <li>
              Initiate the refund to the original payment method used by the
              Poster.
            </li>
          </ul>
          <p className="mb-6 text-gray-700">
            Refund timelines depend on the payment gateway and issuing bank but
            typically take <strong>5–10 business days</strong> after initiation.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            6. Partial Refunds &amp; Adjustments
          </h2>
          <p className="mb-6 text-gray-700">
            In some cases, we may process partial refunds where only a portion of
            the service was completed or where both parties agree on a reduced
            amount. Any commission or platform fee may be adjusted accordingly.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            7. Chargebacks &amp; Disputes
          </h2>
          <p className="mb-6 text-gray-700">
            If a chargeback or dispute is raised with a bank or payment partner,
            we may temporarily withhold payouts or deduct disputed amounts from
            future earnings of the Tasker until the dispute is resolved. We may
            also request supporting documents from both Poster and Tasker.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            8. Contact for Refund Queries
          </h2>
          <p className="mb-4 text-gray-700">
            For any questions regarding this policy or to raise a refund
            request, please contact:
          </p>
          <div className="mb-6 text-gray-700">
            <p className="font-semibold">Naipunya AI Labs Private Limited</p>
            <p>Email: support@extrahand.in</p>
            <p>Website: https://extrahand.in</p>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            This policy may be updated from time to time. The latest version will
            always be available on this page.
          </p>
        </div>
      </div>
    </div>
  );
}

