import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasker Agreement | ExtraHand",
  description:
    "Terms and conditions applicable to Taskers on the ExtraHand marketplace.",
};

export default function TaskerAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Tasker Agreement
        </h1>

        <div className="prose prose-gray max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="text-lg font-semibold mb-4 text-gray-900">
            This Tasker Agreement (&quot;Agreement&quot;) governs your use of
            the ExtraHand platform as a service provider (&quot;Tasker&quot;,
            &quot;you&quot;) and is entered into with{" "}
            <strong>Naipunya AI Labs Private Limited</strong> (&quot;Company&quot;,
            &quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            1. Relationship with ExtraHand
          </h2>
          <p className="mb-6 text-gray-700">
            ExtraHand is a technology platform that connects you with customers
            who require services. Nothing in this Agreement shall be construed as
            creating an employer-employee relationship, partnership, joint
            venture, or agency between you and the Company. You act as an
            independent contractor and are solely responsible for your own taxes,
            compliances, and obligations under applicable law.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            2. Eligibility &amp; KYC
          </h2>
          <p className="mb-4 text-gray-700">
            To operate as a Tasker on ExtraHand, you must:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Be at least 18 years of age and legally capable of contracting.</li>
            <li>
              Complete identity verification (KYC) as required by applicable law
              and our payment partners.
            </li>
            <li>
              Provide accurate and up-to-date information about yourself and your
              services.
            </li>
            <li>
              Maintain an active bank account in your name for receiving payouts.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            3. Use of the Platform
          </h2>
          <p className="mb-4 text-gray-700">
            You agree to use the ExtraHand platform in compliance with:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Our Terms and Conditions and Privacy Policy.</li>
            <li>All applicable laws, regulations, and licensing requirements.</li>
            <li>
              Reasonable standards of professionalism, safety, and customer
              service.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            4. Service Quality &amp; Conduct
          </h2>
          <p className="mb-4 text-gray-700">
            As a Tasker, you are solely responsible for:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>
              Performing services with due skill, care, and diligence as promised
              to the customer.
            </li>
            <li>
              Complying with safety norms and using appropriate tools and
              protective equipment.
            </li>
            <li>
              Not engaging in any illegal, fraudulent, abusive, or harmful
              activities.
            </li>
            <li>
              Respecting the privacy, property, and personal space of customers.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            5. Pricing, Payments &amp; Commission
          </h2>
          <p className="mb-4 text-gray-700">
            Unless otherwise specified on the platform:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>
              You may propose your own price for a task or accept the price
              displayed to you.
            </li>
            <li>
              Payments from customers are collected by our payment gateway
              partners and may be held in escrow until completion of the task.
            </li>
            <li>
              We will deduct a platform commission and any applicable charges
              before paying out the balance to your registered bank account.
            </li>
            <li>
              Payout timelines may vary based on bank and gateway processing and
              compliance checks.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            6. Taxes &amp; Invoicing
          </h2>
          <p className="mb-6 text-gray-700">
            You are solely responsible for determining and fulfilling your tax
            obligations (including GST, income tax, and any other levies) in
            connection with the services you provide. Where required, we may
            issue invoices to customers on your behalf or share transaction
            details to enable you to issue invoices. We may also deduct tax at
            source (TDS) where mandated by law.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            7. Cancellations &amp; Refunds
          </h2>
          <p className="mb-6 text-gray-700">
            You agree to comply with our Refund &amp; Cancellation Policy. Where
            a refund is processed to a customer due to your no-show,
            non-performance, or breach, we may recover the refunded amount and
            associated charges from your current or future payouts.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            8. Ratings, Reviews &amp; Feedback
          </h2>
          <p className="mb-6 text-gray-700">
            Customers may rate and review your services. These ratings are used
            to maintain quality on the platform and may affect your visibility,
            access to tasks, or continued participation. You agree not to
            manipulate ratings or reviews in any manner.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            9. Suspension &amp; Termination
          </h2>
          <p className="mb-6 text-gray-700">
            We may, at our sole discretion, suspend or terminate your Tasker
            account, restrict access to tasks, or withhold payouts in cases of
            suspected fraud, abuse, poor performance, safety concerns, or breach
            of this Agreement or applicable law. You may stop using the platform
            at any time, subject to fulfilling any ongoing commitments to
            customers.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            10. Limitation of Liability
          </h2>
          <p className="mb-6 text-gray-700">
            To the maximum extent permitted by law, our liability to you in
            connection with your use of the platform as a Tasker is limited in
            accordance with the limitation of liability section in our Terms and
            Conditions. You are responsible for your own acts and omissions and
            for any loss or damage caused to customers or third parties.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            11. Contact
          </h2>
          <p className="mb-4 text-gray-700">
            If you have any questions about this Agreement, please contact:
          </p>
          <div className="mb-6 text-gray-700">
            <p className="font-semibold">Naipunya AI Labs Private Limited</p>
            <p>Email: support@extrahand.in</p>
            <p>Website: https://extrahand.in</p>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            This Agreement may be updated from time to time. The latest version
            will always be available on this page.
          </p>
        </div>
      </div>
    </div>
  );
}

