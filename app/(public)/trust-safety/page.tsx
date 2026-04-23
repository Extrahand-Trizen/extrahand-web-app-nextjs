import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trust & Safety | ExtraHand",
  description: "Learn how trust, verification, payments, and support work on ExtraHand.",
};

const sections = [
  {
    title: "How trust works on ExtraHand",
    paragraphs: [
      "ExtraHand is a technology platform that helps Posters and Taskers connect, communicate, manage bookings, and handle payments more clearly. The actual task is carried out by an independent Tasker, but the platform is designed to make the process more accountable for both sides.",
      "Trust on ExtraHand comes from a mix of clear task descriptions, identity checks where required, supported payment flow, ratings and reviews, and a support process for issues that arise during or after a task.",
    ],
  },
  {
    title: "Identity verification and account integrity",
    paragraphs: [
      "All Taskers are required to complete mandatory Aadhaar-based identity verification before they are permitted to accept or perform tasks on the platform. A Tasker's account may also be restricted from receiving payouts until the required verification is successfully completed.",
      "Posters are generally able to use the core platform without Aadhaar verification, but ExtraHand may request basic identity confirmation in situations involving suspected fraud, misuse, or account-risk review.",
    ],
    bullets: [
      "Profiles should always contain accurate, current information.",
      "False identity details, invalid documents, or misleading account information can lead to suspension or permanent deactivation.",
      "Users should keep account credentials secure and report unauthorized access quickly.",
    ],
  },
  {
    title: "Payments, payouts, and task completion",
    paragraphs: [
      "ExtraHand supports online payment flow for tasks booked through the platform. Customers pay the agreed task amount, and Tasker payouts are processed after the task is completed, subject to the platform workflow, dispute handling, and applicable checks.",
      "Under the platform terms, ExtraHand deducts a 5% platform fee from the task amount before remitting the Tasker payout, and GST applies on the platform fee component. The payment flow is structured to reduce confusion around completion, payout timing, and cancellations.",
    ],
    bullets: [
      "Payments are accepted through supported online methods only.",
      "Payouts may be delayed where verification, disputes, refunds, or compliance checks apply.",
      "Refund and cancellation outcomes depend on the timing and circumstances of the booking.",
    ],
  },
  {
    title: "Reviews, communication, and privacy",
    paragraphs: [
      "After a completed task, Posters and Taskers may leave ratings and reviews. These reviews help users make better decisions and help maintain accountability on the platform.",
      "Reviews must be honest and must not be manipulated. Fake ratings, pressure for positive reviews, or attempts to damage another user's reputation unfairly are not acceptable.",
      "Users should also share only the personal information necessary to coordinate the task. For more detail on how data is handled, please review our Privacy Policy.",
    ],
  },
  {
    title: "Safety during real-world tasks",
    paragraphs: [
      "Many tasks happen in homes, offices, shops, and other personal or business spaces. Posters should describe the job accurately and provide a safe environment for the Tasker to work. Taskers should behave professionally, respect privacy and property, and avoid any conduct that could put people or property at risk.",
      "If a task appears illegal, unsafe, or materially different from what was originally described, the issue should be raised immediately instead of continuing as though nothing changed.",
    ],
    bullets: [
      "Keep communication clear about scope, timing, materials, and expected outcome.",
      "Do not use the platform for harassment, fraud, abuse, or unsafe conduct.",
      "Do not try to shift platform-originated work into an off-platform arrangement that bypasses ExtraHand's booking flow.",
    ],
  },
  {
    title: "Disputes, support, and reporting concerns",
    paragraphs: [
      "If there is a problem with a task, payment, no-show, unsafe conduct, or suspicious activity, users should contact ExtraHand as soon as possible with the booking details and any relevant evidence such as messages or photos.",
      "Under the platform terms, complaints relating to task outcome or non-arrival should generally be raised within 24 hours of task completion time or scheduled task time. ExtraHand may review the issue, request more information, and help facilitate a resolution through the support process.",
      "ExtraHand is not the direct provider of the task itself, but it can review disputes, enforce platform rules, and take action where there is fraud, abuse, repeated cancellations, review manipulation, or serious conduct concerns.",
    ],
  },
];

export default function TrustSafetyPage() {
  return (
    <main className="min-h-screen bg-white text-secondary-900">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 md:text-4xl">
            Trust &amp; Safety
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-secondary-600">
            ExtraHand is built to make local tasks more organized and more
            accountable for both Posters and Taskers. This page explains how
            verification, payments, reviews, privacy, and support work across
            the platform.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border-t border-secondary-200 py-8"
            >
              <h2 className="text-2xl font-semibold text-secondary-900">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-7 text-secondary-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {"bullets" in section && section.bullets ? (
                <ul className="mt-4 space-y-3 text-secondary-600">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-3 leading-7">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="border-t border-secondary-200 py-8">
            <h2 className="text-2xl font-semibold text-secondary-900">
              Related pages
            </h2>
            <p className="mt-4 leading-7 text-secondary-600">
              For more detail, you can also read our{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-primary-700 hover:underline"
              >
                Privacy Policy
              </Link>
              ,{" "}
              <Link
                href="/community-guidelines"
                className="font-semibold text-primary-700 hover:underline"
              >
                Community Guidelines
              </Link>
              , and{" "}
              <Link
                href="/terms-and-conditions"
                className="font-semibold text-primary-700 hover:underline"
              >
                Terms and Conditions
              </Link>
              .
            </p>
            <p className="mt-4 leading-7 text-secondary-600">
              To report an issue or request support, contact{" "}
              <a
                href="mailto:support@extrahand.in"
                className="font-semibold text-primary-700 hover:underline"
              >
                support@extrahand.in
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
