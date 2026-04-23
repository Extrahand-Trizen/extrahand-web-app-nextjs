import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ExtraHand",
  description:
    "Privacy Policy for ExtraHand platform operated by Naipunya AI Labs Private Limited",
};

const personalInformation = [
  "Name, email address, and mobile number",
  "Address and profile details",
  "Account credentials and account-related information",
];

const taskInformation = [
  "Task details such as location, timing, and requirements",
  "Messages, attachments, and communication shared through the platform",
  "Booking records and transaction history",
];

const verificationInformation = [
  "KYC details where required",
  "Government-issued identification, where applicable",
  "Fraud-prevention and account-risk review information",
];

const paymentInformation = [
  "Payment and payout details processed through third-party providers",
  "Limited transaction metadata needed to support payment flow, refunds, and reconciliation",
  "We do not store sensitive financial information such as full card details",
];

const technicalInformation = [
  "IP address, device type, operating environment, and browser type",
  "App interactions, usage patterns, and navigation behavior",
  "Log data and security-related activity",
];

const locationInformation = [
  "GPS or approximate location data",
  "Location inputs used for task matching, service delivery, and fraud prevention",
];

const informationUses = [
  "Create and manage user accounts",
  "Enable task posting, booking, communication, payments, and payouts",
  "Match Customers with Taskers",
  "Verify identity and prevent fraud",
  "Provide customer support and resolve disputes",
  "Improve platform performance, reliability, and user experience",
  "Send service-related notifications, updates, and alerts",
  "Comply with legal, tax, and regulatory obligations",
];

const sharingItems = [
  "Between Customers and Taskers where sharing is necessary to coordinate and complete a task",
  "With payment processors, verification partners, hosting providers, messaging services, analytics providers, and other service providers that help us operate the platform",
  "With affiliates, professional advisors, auditors, and contractors where reasonably necessary for operations or compliance",
  "With law enforcement, courts, regulators, or government authorities where required by law or where necessary to protect rights, safety, and the platform",
];

const rights = [
  "Access the personal data we hold about you",
  "Correct inaccurate or incomplete data",
  "Request deletion of your account and data, subject to applicable law",
  "Withdraw consent for certain processing where consent is the basis",
  "Opt out of marketing communications",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3 text-secondary-600">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7">
          <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white text-secondary-900">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-secondary-500">
            Last Updated: April 23, 2026
          </p>
        </header>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            1. Introduction
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            This Privacy Policy explains how Naipunya AI Labs Private Limited
            (&quot;ExtraHand&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;) collects, uses, shares, and
            protects personal information when you access or use the ExtraHand
            platform, including our website, mobile application, and related
            services (collectively, the &quot;Platform&quot;).
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            By using the Platform, you agree to the collection and use of
            information in accordance with this Privacy Policy. This policy is
            intended to help Customers, Taskers, and visitors understand what
            information is collected, why it is collected, and how it supports
            the safe and reliable functioning of ExtraHand.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            2. Information We Collect
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We collect information depending on how you use the Platform as a
            Customer (&quot;Poster&quot;), Tasker, or both. Some information is
            provided directly by you, while some is collected automatically
            through your use of the platform.
          </p>

          <div className="mt-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                a. Personal Information
              </h3>
              <BulletList items={personalInformation} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                b. Task &amp; Transaction Information
              </h3>
              <BulletList items={taskInformation} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                c. Identity &amp; Verification Data
              </h3>
              <BulletList items={verificationInformation} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                d. Payment Information
              </h3>
              <BulletList items={paymentInformation} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                e. Technical &amp; Usage Data
              </h3>
              <BulletList items={technicalInformation} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                f. Location Information
              </h3>
              <BulletList items={locationInformation} />
            </div>
          </div>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            3. How We Use Information
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We use personal information to operate, improve, and secure the
            Platform. This includes essential platform functions such as account
            creation, task coordination, communication, payment handling,
            verification, and support.
          </p>
          <BulletList items={informationUses} />
          <p className="mt-6 font-semibold text-secondary-900">Legal Basis</p>
          <p className="mt-2 leading-7 text-secondary-600">
            We process personal data based on user consent, contractual
            necessity, legal obligations, and legitimate business interests.
            Depending on the context, more than one of these legal bases may
            apply to the same category of information.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            4. Sharing of Information
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We do not sell personal data. We may share information only where
            it is reasonably necessary to operate the Platform, deliver services
            to users, maintain security, or comply with legal obligations.
          </p>
          <BulletList items={sharingItems} />
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            5. Payments, Verification &amp; Third-Party Services
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            Certain services on ExtraHand depend on third-party providers such
            as payment gateways, identity verification services, cloud hosting
            providers, analytics tools, and communication providers. These
            services help support task flow, payment operations, fraud
            prevention, notifications, and platform performance.
          </p>
          <BulletList
            items={[
              "Payment gateways such as UPI, cards, net banking, and wallets",
              "Identity verification and KYC providers",
              "Cloud hosting and infrastructure providers",
              "Analytics, messaging, and communication tools",
            ]}
          />
          <p className="mt-4 leading-7 text-secondary-600">
            These providers may process your data under their own privacy
            policies and compliance obligations. We encourage users to review
            those terms where relevant.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            6. Cookies &amp; Tracking Technologies
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We use cookies and similar technologies to maintain sessions,
            remember preferences, support platform security, analyze usage, and
            improve performance. Some cookies are essential to the working of
            the Platform, while others may be optional depending on your
            settings and the features being used.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            Optional cookies may be used for analytics, measurement, or
            integrations where required. For more detail, please see our{" "}
            <Link
              href="/cookie-policy"
              className="font-semibold text-primary-700 hover:underline"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            7. Data Security
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We implement industry-standard technical and organizational
            measures to protect personal data against unauthorized access, loss,
            misuse, or alteration. These safeguards may include access
            controls, monitoring, encryption practices where appropriate, and
            internal processes designed to reduce security risk.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            While we strive to protect your data, no system is completely
            secure. Users should also protect their own account credentials and
            report any suspected unauthorized activity promptly.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            8. Data Retention
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We retain personal data only as long as necessary to provide
            services, maintain business and legal records, resolve disputes,
            prevent fraud, and comply with legal and regulatory obligations.
          </p>
          <BulletList
            items={[
              "Provide services and maintain account functionality",
              "Maintain transaction and operational records",
              "Resolve disputes and investigate complaints",
              "Prevent fraud and enforce platform policies",
              "Comply with legal and regulatory obligations",
            ]}
          />
          <p className="mt-4 leading-7 text-secondary-600">
            Certain data may be retained even after account deletion where such
            retention is required by law, necessary for fraud prevention, or
            needed for dispute resolution and compliance purposes.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            9. Your Rights &amp; Choices
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            Subject to applicable law, you may have rights regarding the
            personal information we hold about you. We may need to verify your
            identity before acting on any request.
          </p>
          <BulletList items={rights} />

          <h3 className="mt-8 text-lg font-semibold text-secondary-900">
            Account Deletion
          </h3>
          <p className="mt-3 leading-7 text-secondary-600">
            You can request account deletion from your Profile by going to
            Privacy, then opening Advanced Settings, where the Delete Account
            option will be available.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            An account deletion request can only be submitted if there are no
            ongoing tasks linked to your account. Once a valid deletion request
            is submitted, the account is scheduled for deletion within 24 to 48
            hours.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            During that pending period, you may cancel the deletion request
            through the same privacy settings flow. Once the deletion is
            completed, your personal data will be deleted or anonymized where
            reasonably possible, although certain information may still be
            retained for legal, fraud prevention, dispute resolution, tax, or
            regulatory purposes.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            10. Children&apos;s Privacy
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            The Platform is not intended for individuals under the age of 18.
            We do not knowingly collect personal data from minors. If we become
            aware that such data has been collected, we will take reasonable
            steps to delete it or otherwise handle it in accordance with
            applicable law.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            11. Policy Updates
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We may update this Privacy Policy from time to time to reflect
            changes in our services, operations, business needs, or legal
            requirements. The updated version will be posted on this page with
            the revised date so users can review the current policy at any
            time.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            12. Contact &amp; Grievance
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or your data, please contact:
          </p>

          <div className="mt-4 space-y-1 text-secondary-600">
            <p className="font-semibold text-secondary-900">
              Company: Naipunya AI Labs Private Limited
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:support@extrahand.in"
                className="font-semibold text-primary-700 hover:underline"
              >
                support@extrahand.in
              </a>
            </p>
            <p>Website: https://extrahand.in</p>
          </div>

          <p className="mt-6 leading-7 text-secondary-600">
            We will acknowledge complaints within 48 hours and resolve them as
            per applicable law.
          </p>

          <p className="mt-8 text-sm text-secondary-500">
            &copy; 2026 Naipunya AI Labs Private Limited. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}
