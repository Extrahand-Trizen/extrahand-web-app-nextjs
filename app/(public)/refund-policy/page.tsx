import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | ExtraHand",
  description:
    "Complete refund and cancellation policy for the ExtraHand marketplace. Learn about cancellation windows, refund timelines, tasker penalties, dispute resolution, and more.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: March 2025 &nbsp;&middot;&nbsp; Effective for all
          bookings made on ExtraHand
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 space-y-10 text-gray-700">

          {/* INTRO */}
          <section>
            <p className="text-base leading-relaxed">
              This Refund &amp; Cancellation Policy (&quot;Policy&quot;) governs
              all monetary transactions made on the ExtraHand marketplace
              platform (&quot;Platform&quot;), operated by{" "}
              <strong>Naipunya AI Labs Private Limited</strong> (&quot;we&quot;,
              &quot;us&quot;, or &quot;our&quot;), a company incorporated under
              the Companies Act, 2013, with its registered office in India.
            </p>
            <p className="text-base leading-relaxed mt-3">
              By making or accepting a booking on ExtraHand, you agree to be
              bound by this Policy in addition to our{" "}
              <a href="/terms-and-conditions" className="text-blue-600 underline hover:text-blue-800">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-blue-600 underline hover:text-blue-800">
                Privacy Policy
              </a>
              . Please read this Policy carefully before placing a booking.
            </p>
          </section>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              1. About the ExtraHand Marketplace
            </h2>
            <p className="mb-3 leading-relaxed">
              ExtraHand is a technology-based marketplace that connects
              individuals and businesses (&quot;Posters&quot;) who need everyday
              tasks completed, with skilled independent service providers
              (&quot;Taskers&quot;). ExtraHand itself does not perform tasks; it
              facilitates the connection and manages payments in accordance with
              RBI-compliant payment processing norms.
            </p>
            <p className="mb-3 leading-relaxed">
              All payments made at the time of booking are collected by
              ExtraHand and held in escrow via our payment partner (Razorpay)
              until the task is successfully delivered or a cancellation /
              dispute resolution outcome is reached.
            </p>
            <p className="leading-relaxed">
              Because ExtraHand acts as an intermediary marketplace, its ability
              to issue refunds is subject to the conditions described in this
              Policy, applicable payment-gateway terms, and Indian law.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              2. Understanding What You Pay
            </h2>
            <p className="mb-3 leading-relaxed">
              When a Poster books a task, the total amount charged at checkout
              consists of:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Task Amount</strong> — the price agreed between the
                Poster and the Tasker for completing the task.
              </li>
              <li>
                <strong>Platform Fee</strong> — a service charge (a percentage
                of the task amount) collected by ExtraHand for providing the
                platform, trust infrastructure, payment processing, and customer
                support.
              </li>
              <li>
                <strong>GST</strong> — Goods &amp; Services Tax levied by the
                Government of India on the platform fee, as applicable.
              </li>
            </ul>
            <p className="mb-3 leading-relaxed">
              The breakdown of each component is shown on the booking
              confirmation screen and in your booking receipt. <strong>Refunds
              are always calculated on the task amount only</strong> unless
              explicitly stated otherwise in this Policy. The platform fee and
              GST are non-refundable in all standard cancellation scenarios (see
              Section 3 for the rationale).
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              3. Why the Platform Fee Is Non-Refundable
            </h2>
            <p className="mb-3 leading-relaxed">
              The platform fee covers real costs incurred by ExtraHand at the
              time of and immediately after booking, regardless of whether the
              task is subsequently cancelled:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Payment gateway processing charges on the full transaction amount, which are non-recoverable once charged.</li>
              <li>Background verification and trust-and-safety infrastructure costs.</li>
              <li>Platform operational costs including customer support, matching algorithms, and dispute handling.</li>
              <li>GST remitted to the government on the platform fee cannot be reclaimed after payment.</li>
            </ul>
            <p className="mb-3 leading-relaxed">
              Additionally, refunding the platform fee would create a financial
              incentive for Posters and Taskers to arrange repeat work directly
              outside the platform after an initial meeting, depriving both
              parties of the consumer protection, payment security, and
              insurance coverage that ExtraHand provides.
            </p>
            <p className="leading-relaxed">
              This approach is consistent with industry-standard practices
              adopted by other gig-economy marketplaces globally.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              4. Poster-Side Cancellation Policy
            </h2>
            <p className="mb-4 leading-relaxed">
              A Poster may cancel a confirmed booking at any time before the
              task is marked as &quot;In Progress&quot;. The refund on the{" "}
              <strong>task amount</strong> depends on how far in advance of the
              scheduled task start time the cancellation is made.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              4.1 Grace Period — 100% Refund
            </h3>
            <p className="mb-4 leading-relaxed">
              If a Poster cancels within <strong>15 minutes of booking
              confirmation</strong>, a full 100% refund of the task amount is
              issued, regardless of the task start time. This grace period is
              designed to allow Posters to correct accidental bookings or change
              their mind immediately after payment without penalty.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              4.2 Cancellation Windows &amp; Refund Schedule
            </h3>
            <p className="mb-4 leading-relaxed">
              Once the 15-minute grace period has passed, the following
              cancellation windows apply:
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-800 font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-200">Cancellation Timing</th>
                    <th className="px-4 py-3 border-b border-gray-200">Refund on Task Amount</th>
                    <th className="px-4 py-3 border-b border-gray-200">Retention / Tasker Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">More than 24 hours before task start</td>
                    <td className="px-4 py-3 text-green-700 font-bold">100%</td>
                    <td className="px-4 py-3">Nil</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Between 1 hour and 24 hours before task start</td>
                    <td className="px-4 py-3 text-yellow-700 font-bold">90%</td>
                    <td className="px-4 py-3">10% forwarded to the Tasker as a compensation for lost opportunity</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Less than 1 hour before task start</td>
                    <td className="px-4 py-3 text-red-700 font-bold">80%</td>
                    <td className="px-4 py-3">20% forwarded to the Tasker who may have already prepared or travelled</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              * The platform fee and GST are excluded from refund calculations in
              all rows above. Only the task amount is refunded at the stated
              percentage.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              4.3 Why Taskers Receive a Share on Late Cancellations
            </h3>
            <p className="mb-3 leading-relaxed">
              When a Poster cancels with less than 24 hours notice, the Tasker
              has likely already committed to the booking — having potentially
              declined other opportunities or made preparations (purchasing
              supplies, arranging transport, setting aside time). A partial
              compensation acknowledges this economic cost and protects the
              Tasker&apos;s livelihood.
            </p>
            <p className="leading-relaxed">
              This is consistent with how other gig-economy platforms handle
              late cancellations: most platforms (e.g., Airtasker, TaskRabbit)
              either retain the platform fee or forward a portion to the Tasker
              when cancellations are made close to the task start time.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              4.4 After Task Is Started
            </h3>
            <p className="leading-relaxed">
              Once a task is marked <strong>&quot;In Progress&quot;</strong> by
              the Tasker, cancellations are not eligible for an automatic refund.
              In such cases, the Poster must raise a dispute (see Section 9) and
              ExtraHand will mediate based on the work completed and evidence
              provided by both parties.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              5. Tasker-Side Cancellation Policy
            </h2>
            <p className="mb-4 leading-relaxed">
              If a Tasker cancels a confirmed booking, the Poster is always
              entitled to a <strong>100% refund of the total amount paid</strong>{" "}
              — including platform fee and taxes — because the Poster is not at
              fault for the cancellation. ExtraHand will also attempt to rematch
              the Poster with an alternative qualified Tasker where possible.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              5.1 Tasker Penalty Schedule
            </h3>
            <p className="mb-4 leading-relaxed">
              Taskers who cancel confirmed bookings may be subject to a penalty
              deducted from their wallet balance or future payouts, as follows:
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-800 font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-200">Cancellation Timing</th>
                    <th className="px-4 py-3 border-b border-gray-200">Poster Refund</th>
                    <th className="px-4 py-3 border-b border-gray-200">Tasker Penalty (on Task Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">More than 24 hours before task start</td>
                    <td className="px-4 py-3 text-green-700 font-bold">100% (total paid)</td>
                    <td className="px-4 py-3 text-gray-600">Minimal or none (first occurrence)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Less than 24 hours before task start</td>
                    <td className="px-4 py-3 text-green-700 font-bold">100% (total paid)</td>
                    <td className="px-4 py-3 text-yellow-700 font-bold">10% of task amount</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Less than 1 hour before task start</td>
                    <td className="px-4 py-3 text-green-700 font-bold">100% (total paid)</td>
                    <td className="px-4 py-3 text-red-700 font-bold">15% of task amount</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              5.2 Repeated Cancellations by Taskers
            </h3>
            <p className="mb-3 leading-relaxed">
              Taskers who repeatedly cancel confirmed bookings — regardless of
              the reason — may face:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatic demotion in search rankings and reduced task visibility.</li>
              <li>Temporary suspension of the ability to apply for new tasks.</li>
              <li>Permanent account suspension in cases of persistent or fraudulent cancellations.</li>
              <li>Negative impact on their public profile rating.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              6. Eligible Refund Situations (Non-Cancellation)
            </h2>
            <p className="mb-3 leading-relaxed">
              Apart from voluntary cancellations, a Poster may also be eligible
              for a full or partial refund in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Tasker No-Show:</strong> The Tasker does not arrive or
                begin the task within a reasonable time after the scheduled
                start, and is unresponsive.
              </li>
              <li>
                <strong>Task Not Completed:</strong> The Tasker abandons the
                task midway without valid reason, resulting in incomplete or
                unusable work.
              </li>
              <li>
                <strong>Materially Different Service:</strong> The service
                delivered is materially different from what was described and
                agreed upon in the booking, and the Poster raises a dispute
                within 72 hours.
              </li>
              <li>
                <strong>Duplicate Payment:</strong> A clearly demonstrable
                technical error results in the Poster being charged more than
                once for the same booking.
              </li>
              <li>
                <strong>Unauthorised Transaction:</strong> A booking is made
                without the account holder&apos;s knowledge or consent and is
                reported promptly to ExtraHand and the relevant financial
                institution.
              </li>
            </ul>
            <p className="leading-relaxed">
              In all eligible situations above, ExtraHand will investigate and
              may request supporting evidence (photos, messages, receipts) from
              both parties before processing a refund.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              7. Non-Refundable Situations
            </h2>
            <p className="mb-3 leading-relaxed">
              Refunds will <strong>not</strong> be provided in any of the
              following scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Change of mind</strong> after the Tasker has already
                started or completed the task, unless both parties mutually
                agree otherwise.
              </li>
              <li>
                <strong>Subjective dissatisfaction</strong> where the Tasker has
                reasonably complied with the agreed scope and description of work.
              </li>
              <li>
                <strong>Late refund requests</strong> raised more than 72 hours
                after the scheduled task completion time.
              </li>
              <li>
                <strong>Disputes arising from miscommunication</strong> between
                Poster and Tasker that occurred outside the ExtraHand platform
                chat (e.g., phone calls or WhatsApp), where we cannot verify
                the agreed scope.
              </li>
              <li>
                <strong>Tasks cancelled by the Poster</strong> after the task
                has been marked &quot;In Progress&quot; without raising a formal
                dispute.
              </li>
              <li>
                <strong>Platform fee and GST</strong> in any standard
                cancellation scenario (Poster or Tasker initiated).
              </li>
              <li>
                <strong>Force majeure events</strong> such as natural disasters,
                government-imposed curfews, or declared emergencies, subject to
                ExtraHand&apos;s discretion on a case-by-case basis.
              </li>
              <li>
                <strong>Regulatory holds</strong>: Where law enforcement or
                regulatory authorities direct that funds be held, withheld, or
                adjusted.
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              8. Refund Request Window
            </h2>
            <p className="mb-3 leading-relaxed">
              To be eligible for a refund outside of an automated cancellation,
              Posters must raise a refund request within{" "}
              <strong>72 hours of the scheduled task completion time</strong>{" "}
              or actual completion (whichever is earlier). Requests raised after
              this window will generally not be accepted, except in cases of
              fraud or demonstrable technical error.
            </p>
            <p className="mb-3 leading-relaxed">
              Refund requests can be raised through:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The &quot;Report an Issue&quot; option on the task details page within the ExtraHand app or website.</li>
              <li>Emailing <strong>support@extrahand.in</strong> with your booking ID and a description of the issue.</li>
              <li>Contacting our support team via the in-app chat feature.</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              9. Dispute Resolution
            </h2>
            <p className="mb-3 leading-relaxed">
              Where a Poster and Tasker cannot agree on the outcome of a task or
              the validity of a cancellation, either party may escalate the
              matter to ExtraHand for mediation. The process is as follows:
            </p>
            <ol className="list-decimal pl-6 space-y-3 mb-4">
              <li>
                <strong>Raise a Dispute:</strong> The aggrieved party raises a
                dispute via the task page or by emailing support, within 72
                hours of the task completion or cancellation.
              </li>
              <li>
                <strong>Evidence Submission:</strong> Both parties will be
                invited to submit supporting evidence — such as photos, task
                descriptions, in-app chat logs, receipts, and any other
                relevant documentation — within 48 hours of the dispute being
                opened.
              </li>
              <li>
                <strong>ExtraHand Review:</strong> Our Trust &amp; Safety team
                will review all submitted evidence and make a determination
                within <strong>5–7 business days</strong>.
              </li>
              <li>
                <strong>Resolution:</strong> ExtraHand&apos;s decision may
                result in a full refund to the Poster, full or partial payment
                release to the Tasker, or a split outcome. ExtraHand&apos;s
                decision is final, subject to applicable law.
              </li>
            </ol>
            <p className="leading-relaxed">
              ExtraHand endeavours to act as a neutral mediator. We reserve the
              right to suspend accounts pending investigation if fraudulent
              behaviour is suspected from either party.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              10. How Refunds Are Processed
            </h2>
            <p className="mb-3 leading-relaxed">
              Once a refund is approved by ExtraHand (either automatically upon
              cancellation or after a dispute resolution), the following process
              applies:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Any escrowed funds pending release to the Tasker are reversed
                or withheld as applicable.
              </li>
              <li>
                The approved refund amount is initiated to the{" "}
                <strong>original payment method</strong> used at the time of
                booking (UPI, debit/credit card, net banking, etc.).
              </li>
              <li>
                Refunds typically reflect within{" "}
                <strong>5–10 business days</strong> after initiation, depending
                on your bank and payment provider. In some cases, particularly
                for credit cards, it may take up to 15 business days.
              </li>
              <li>
                ExtraHand does not issue refunds via cash, cheque, or any
                payment method other than the original payment instrument.
              </li>
              <li>
                If the original payment method is no longer valid (e.g., expired
                card), please contact support for an alternate resolution.
              </li>
            </ul>
            <p className="leading-relaxed">
              You will receive an email notification once the refund has been
              initiated, along with a reference ID for tracking.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              11. Partial Refunds &amp; Adjustments
            </h2>
            <p className="mb-3 leading-relaxed">
              In certain situations, ExtraHand may issue a partial refund where:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Only part of the task was completed by the Tasker.</li>
              <li>Both parties agree to a reduced settlement amount.</li>
              <li>ExtraHand&apos;s dispute team determines that partial compensation is fair given the evidence.</li>
              <li>A late cancellation penalty (Poster) or cancellation compensation (Tasker) applies.</li>
            </ul>
            <p className="leading-relaxed">
              Partial refunds are processed in the same manner as full refunds
              and are subject to the same timelines.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              12. Escrow &amp; Payment Holding
            </h2>
            <p className="mb-3 leading-relaxed">
              All payments made on ExtraHand are held in escrow via our payment
              partner (Razorpay) and are not released to the Tasker until:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The Poster marks the task as &quot;Completed&quot; and confirms satisfaction, or</li>
              <li>The task is automatically marked complete after a defined period has elapsed post-task-end without a dispute.</li>
            </ul>
            <p className="leading-relaxed">
              This escrow mechanism protects Posters by ensuring that payment is
              not released until they have confirmed satisfactory completion. It
              also protects Taskers by ensuring that the payment exists and
              cannot be recalled by the Poster after work has begun.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              13. Chargebacks &amp; Bank Disputes
            </h2>
            <p className="mb-3 leading-relaxed">
              We encourage users to contact ExtraHand directly before initiating
              a chargeback or payment dispute with their bank or card issuer, as
              we are typically able to resolve issues faster through our internal
              process.
            </p>
            <p className="mb-3 leading-relaxed">
              If a chargeback is raised directly with a bank or payment partner:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>We may temporarily withhold payouts to the relevant Tasker until the chargeback is resolved.</li>
              <li>We may deduct the disputed amount from the Tasker&apos;s future earnings if we determine the chargeback is valid.</li>
              <li>We will submit evidence to the payment gateway to contest fraudulent or unjustified chargebacks.</li>
              <li>Accounts that repeatedly initiate unjustified chargebacks may be suspended.</li>
            </ul>
            <p className="leading-relaxed">
              ExtraHand reserves the right to recover costs associated with
              defending unjustified chargebacks from the party who initiated
              them.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              14. Cancellations Due to Exceptional Circumstances
            </h2>
            <p className="mb-3 leading-relaxed">
              ExtraHand may, at its sole discretion, issue full or partial
              refunds outside the standard policy in cases of genuinely
              exceptional circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Medical emergencies</strong> affecting the Poster or an
                immediate family member, supported by documentation.
              </li>
              <li>
                <strong>Natural disasters</strong> or government-declared
                emergencies making it impossible to proceed with the task.
              </li>
              <li>
                <strong>Verified platform errors</strong> or technical faults
                on the ExtraHand platform that directly caused the booking to
                fail or be charged incorrectly.
              </li>
            </ul>
            <p className="leading-relaxed">
              Requests under this section must be made within 48 hours of the
              exceptional event and must be accompanied by supporting evidence.
              ExtraHand&apos;s decision in such cases is final.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              15. Taxes &amp; Regulatory Deductions
            </h2>
            <p className="mb-3 leading-relaxed">
              All refunds are processed exclusive of GST that has been remitted
              to the government. As per prevailing Indian tax regulations, GST
              paid on the platform fee and on the booking amount cannot be
              reversed once it has been collected and remitted. Any applicable
              TDS (Tax Deducted at Source) deducted from Tasker payouts is also
              non-refundable and will be reflected in the Tasker&apos;s annual
              Form 26AS.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              16. Policy Changes
            </h2>
            <p className="leading-relaxed">
              ExtraHand reserves the right to amend this Policy at any time.
              Changes will be posted on this page with an updated &quot;Last
              Updated&quot; date. We will notify registered users of material
              changes via email or in-app notification. Continued use of the
              platform after changes are posted constitutes acceptance of the
              revised Policy.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              17. Governing Law &amp; Jurisdiction
            </h2>
            <p className="leading-relaxed">
              This Policy is governed by the laws of India. Any disputes arising
              out of or in connection with this Policy shall be subject to the
              exclusive jurisdiction of the courts located in{" "}
              <strong>Bengaluru, Karnataka, India</strong>, subject to the
              arbitration provisions set out in our Terms &amp; Conditions.
            </p>
          </section>

          {/* 18 – Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              18. Contact Us
            </h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions about this Policy, wish to raise a refund
              request, or need assistance with a cancellation or dispute, please
              reach out to our support team:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 space-y-1 border border-gray-200">
              <p className="font-semibold text-gray-900">Naipunya AI Labs Private Limited</p>
              <p>
                <span className="text-gray-500">Email:</span>{" "}
                <a href="mailto:support@extrahand.in" className="text-blue-600 hover:underline">
                  support@extrahand.in
                </a>
              </p>
              <p>
                <span className="text-gray-500">Website:</span>{" "}
                <a href="https://extrahand.in" className="text-blue-600 hover:underline">
                  https://extrahand.in
                </a>
              </p>
              <p>
                <span className="text-gray-500">Support Hours:</span> Monday –
                Saturday, 9:00 AM – 6:00 PM IST
              </p>
            </div>
          </section>

          <p className="text-xs text-gray-400 pt-6 border-t border-gray-100">
            This policy was last updated in March 2025 and is effective for all
            bookings made on or after the effective date. Earlier bookings remain
            subject to the version of this policy in force at the time of
            booking.
          </p>

        </div>
      </div>
    </div>
  );
}
